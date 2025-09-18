import { validationResult } from "express-validator";
import userFinder from "../utils/userUtls/userFinder.js"
import userCreater from "../services/user.service.js";
import crypto from "crypto";
import createOtp from "../utils/OtpFeature/OtpMaker.js";
import {sendEmail} from "../utils/EmailUtils/EmailFeature.js"
import * as EmailTemplates from "../Templates/EmailTemplates.js"
import userModel from "../models/user.model.js"
import cleanUser from "../utils/userUtls/cleanUpUser.js";

const userRegister = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {
        firstName, 
        lastName, 
        number, 
        email, 
        altnumber, 
        pinCode, 
        address, 
        password
    } = req.body;

    const userExists = await userFinder(
        {
            key: "email", 
            query: email,
            lean: true
        }
    );

    if(userExists){
        return res.status(400).json({message: "User with this email already exists"});
    }
    const otp = createOtp(6);
    const hashedOtp = crypto.createHash("sha1").update(otp).digest("hex");

    const user = await userCreater(
        {
            firstName, 
            lastName, 
            number, 
            email, 
            altnumber, 
            pinCode, 
            address, 
            password,
            otp: hashedOtp,
            otpExpires: Date.now() + 10 * 60 * 1000
        }
    )

    res.status(201).json({
        identifier: user.email,
    });

    sendEmail({
        email,
        sub: "Verify your Account With The OTP",
        mess: EmailTemplates.registerOtp({firstname: user.fullName.firstName,lastName: user.fullName.lastName, otp})
    }).catch(err => console.error("Email sending failed:", err));
    
}

const userLogin = async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        identifier,
        password
    } = req.body;

    const idStr = String(identifier).toLowerCase().trim();
    const key = idStr.includes("@") ? "email" : "phoneNumber";

    const user = await userFinder(
        {
           key,
           query: identifier,
           includePassword : true
        }
    )

    if( !user ){
        return res.status(404).json({message:"User Not found"})
    }

    const isMatch = await user.comparePassword(password);

    if( !isMatch ){
        return res.status(401).json({message: "Invalid credentials"})
    }

    const otp = createOtp(6);

    const hashedOtp = crypto.createHash("sha1").update(otp).digest("hex");

    await userModel.findOneAndUpdate({[key]:identifier},{
        otp: hashedOtp,
        otpExpires: Date.now() + 10 * 60 * 1000
    })

    res.status(200).json({
            identifier: user.email
    })

    sendEmail({
        email: user.email,
        sub: "Verify your Account With The OTP",
        mess: EmailTemplates.loginOtp({firstname: user.fullName.firstName,lastName: user.fullName.lastName, otp})
    }).catch(err => console.error("Email sending failed:", err));
}

const verifyOtp = async (req, res)=>{
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({errors: errors.array()});
    }

    const {
        email,
        otp
    } = req.body;

    const user = await userFinder(
        {
           key: "email",
           query: email,
        }
    )
    if(!user){
        return res.status(404).json({message:"User Not found"})
    }

    const hashedOtp = crypto.createHash("sha1").update(otp).digest("hex");

    if(user.otp !== hashedOtp || user.otpExpires < Date.now()){
        return res.status(401).json({
            message: "Invalid or expired OTP"
        })
    }

    await userModel.findOneAndUpdate({"email": email},{
        otp:null,
        otpExpires: null
    });

    const token = user.generateToken();

     res.cookie("userToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none", // change to 'none' if using cross-site cookies
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

    const finalUserData = cleanUser(user)

    res.status(200).json({
        message: "Login Successfully.",
        metaData: finalUserData,
    })
}

const getProfile = async (req, res)=>{
    res.status(200).json({metaData: req.user})
};

export {
    userRegister,
    userLogin,
    verifyOtp,
    getProfile
}
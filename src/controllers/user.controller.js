import { validationResult } from "express-validator";
import userFinder from "../utils/userUtls/userFinder.js"
import userCreater from "../services/user.service.js";
import crypto from "crypto";
import createOtp from "../utils/OtpFeature/OtpMaker.js";
import {sendEmail} from "../utils/EmailUtils/EmailFeature.js"
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
            query: email
        }
    );

    if(userExists){
        return res.status(400).json({message: "User with this email already exists"});
    }
    const otp = createOtp(6);
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

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

    res.status(201).json({message: "Please verify the otp sent to your email(check SPAM & INBOX)"});

    return await sendEmail({
        email,
        sub: "Your OTP for Shop Portfolio",
        mess: `<p>Your OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`
    })
    
}

export {userRegister}
import { validationResult } from "express-validator";
import adminModel from "../models/admin.model.js"
import adminCreater from "../services/admin.service.js";
import cleanAdmin from "../utils/adminsUtls/cleanUpAdmin.js";
import adminFinder from "../utils/adminsUtls/adminFinder.js";
import blackListeTokenModel from "../models/blackListToken.model.js"
const adminRegister = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }
    const adminCount = await adminModel.estimatedDocumentCount();
    if(adminCount > 2){
        return res.status(401).json({message: "admin is not allowed by KT Computech"})
    }
    const {name, email, password} = req.body;
    const existAdmin = await adminFinder({key: "email", query: email});
    if(existAdmin){
        return res.status(401).json({message: "Admin already register, Please Login!"});
    }
    const admin = await adminCreater({name, email, password, count: adminCount});
    const token = admin.generateToken();
    res.cookie("adminToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", 
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    const hiddenDetsAdmin = cleanAdmin(admin);
    res.status(200).json({
        hiddenDetsAdmin
    })
}

const adminLogin = async (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }
    const {email, password} = req.body;
    const admin = await adminFinder({key: "email", query: email, includePassword: true})
    const matchPassword = await admin.comparePassword(password);
    if(!matchPassword){
        return res.status(401).json({message: "email or password something went wrong!"});
    }
    const token = admin.generateToken();
     res.cookie("adminToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", 
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    const hiddenDetsAdmin = cleanAdmin(admin);
    res.status(200).json({
        hiddenDetsAdmin
    })
}

const getProfile = async (req, res)=>{
    const hiddenDetsAdmin = cleanAdmin(req.admin);
    return res.status(200).json({
        hiddenDetsAdmin
    })
}

const adminLogOut = async (req, res)=> {
    const token = req.token;
    await blackListeTokenModel.create({token});
    return res.status(200).json({message: "Admin LogOut Successfully"});
}


export {adminRegister, adminLogin, getProfile, adminLogOut}
import pinCodeModel from "../models/pincode.model.js";
import { validationResult } from "express-validator";
const pinCodeAdding = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }
    const {pinCode} = req.body;
    const pin_Code = await pinCodeModel.create({
        pinCode
    })
    return res.status(201).json(pin_Code);
}

const ShowAllPinCode = async (req,res) => {
    const allPinCode = await pinCodeModel.find().select("pinCode");
    return res.status(200).json(allPinCode)
}

const checkPinCode = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()})
    }
    const {pinCode} = req.body;
    const avaliable = await pinCodeModel.findOne({pinCode});
    console.log(pinCode, avaliable)
    if(!avaliable){
        return res.status(200).json({message: "Pincode is Not Servicable"});
    }
    return res.status(200).json({message: "Pincode is Servicable"});
}

export {
    pinCodeAdding,
    ShowAllPinCode,
    checkPinCode
}
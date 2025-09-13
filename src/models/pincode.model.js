import mongoose from "mongoose";

const pinCodeSchema = new mongoose.Schema({
    pinCode: {
        type: Number,
        default: null,
        unique:true,
        index: true,
    }
},{timestamps:true});

const pinCodeModel = mongoose.model("pinCode", pinCodeSchema);

export default pinCodeModel;
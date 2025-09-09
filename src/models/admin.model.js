import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
        index:true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["superAdmin", "admin"],
        required: true,
        default: "admin"
    }
},{timestamps: true});

adminSchema.methods.generateToken = function(){
    const token = jwt.sign({id:this._id},process.env.JWT_KEY,{expiresIn: process.env.ADMIN_TOKEN_EXPIRE});
        return token;
}

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, Number(process.env.SALT_NUMBER));
};

const adminModel = mongoose.model("admin", adminSchema);

export default adminModel;
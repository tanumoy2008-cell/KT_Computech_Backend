import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    fullName: {
        firstName:{
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        }
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        requred: true,
        unique: true,
        index: true,
    },
    alternateNumber: {
        type: Number,
        default: null,
    },
    pinCode: {
        type: Number,
        required: true,
        index: true,
    },
    address:{
        type: String,
        required: true,
    },
    otp: {
        type: String,
        default: null,
    },
    otpExpires: {
        type: Date,
        default: null,
    },
    cart:[
        {
        productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                index: true,
        },
        quantity: {
                type: Number,
                default: 1,
        }
     }
    ]
},{timestamps: true});

userSchema.methods.generateToken = function(){
    const token = jwt.sign({id: this._id},process.env.JWT_KEY, {expiresIn: process.env.USER_TOKEN_EXPIRE});
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function (password) {
     return await bcrypt.hash(password, Number(process.env.SALT_NUMBER));    
}

const userModel = mongoose.model("user", userSchema);

export default userModel;
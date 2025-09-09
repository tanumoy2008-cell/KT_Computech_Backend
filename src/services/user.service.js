import userModel from "../models/user.model.js"
import { BadRequestError } from "../utils/error.js"
const userCreater = async ({firstName, lastName, password, number, email, altnumber, pinCode, address, otp, otpExpires}) => {
    if(!firstName || !lastName || !password || !number || !email || !altnumber || !pinCode || !address || !otp || !otpExpires){
        throw new BadRequestError();
    }
    const hasedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        fullName:{
            firstName,
            lastName
        },
        email,
        password: hasedPassword,
        number, 
        email, 
        altnumber, 
        pinCode, 
        address
    })
    return user;
}

export default userCreater;
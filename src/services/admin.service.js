import adminModel from "../models/admin.model.js"
import { BadRequestError } from "../utils/error.js"
const adminCreater = async ({name, email, password, count}) => {
    if(!name || !email || !password){
        throw new BadRequestError();
    }
    const hasedPassword = await adminModel.hashPassword(password);

    const admin = await adminModel.create({
        name,
        email,
        password: hasedPassword,
        role: count == 0 ? "superAdmin" : "admin"
    })
    return admin;
}

export default adminCreater;
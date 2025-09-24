import jwt from "jsonwebtoken";
import userFinder from "../utils/userUtls/userFinder.js";
import blackListeTokenModel from "../models/blackListToken.model.js"
const isLoggedInUser = async (req, res, next) => {
  try {
    const token = req.cookies?.userToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied!" });
    }
    const tokenBlackList = await blackListeTokenModel.findOne({token})
    if(tokenBlackList) {
      return res.status(401).json({ message: "An Unathorized access!" });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await userFinder({key: "_id", query: decoded.id, select: "-__v -password -createdAt -updatedAt -cart -orderHistory -otp -otpExpires"})
    req.user = user;
    if (!req.user) {
      return res.status(500).json({ message: "User not found!" });
    }
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

export default isLoggedInUser;
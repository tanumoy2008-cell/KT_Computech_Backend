import jwt from "jsonwebtoken";
import adminFinder from "../utils/adminsUtls/adminFinder.js";
import blackListeTokenModel from "../models/blackListToken.model.js"
const isLoggedInAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    console.log(token)
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
    req.admin = await adminFinder({key: "_id", query: decoded.id, select: "-password -createdAt -updatedAt -__v "})
    if (!req.admin) {
      return res.status(500).json({ message: "Admin not found!" });
    }
    req.token = token;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

export default isLoggedInAdmin;
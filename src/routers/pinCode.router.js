import express from "express";
import tryCatch from "../utils/tryCatch.js";
import isLoggedInAdmin from "../middlewares/admin.middleware.js";
import * as pinCodeController from "../controllers/pincode.controller.js";
import { body } from "express-validator"
const router = express.Router();

router.post("/add", [
    body("pinCode").notEmpty().isNumeric().isLength({min: 6, max: 6}).withMessage("Pin-Code is Not valid please, give the right Pin-Code")
], isLoggedInAdmin, tryCatch(pinCodeController.pinCodeAdding));

router.get("/show-all-pincode", isLoggedInAdmin, tryCatch(pinCodeController.ShowAllPinCode));

router.post("/check-avaliable-pincode",[
    body("pinCode").notEmpty().isNumeric().isLength({min: 6, max: 6}).withMessage("Pin-Code is Not valid please, give the right Pin-Code")
], tryCatch(pinCodeController.checkPinCode));

export default router;
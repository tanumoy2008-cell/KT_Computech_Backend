import express from "express";
import tryCatch from "../utils/tryCatch.js";
import * as adminController from "../controllers/admin.controller.js"
import { body } from "express-validator";
import isLoggedInAdmin from "../middlewares/admin.middleware.js"
const router = express.Router()

router.post(
    "/register", [
    body("name")
    .notEmpty()
    .isString()
    .isLength({min:3, max:30})
    .withMessage("Name will be in between 3 to 30 charecters."),

    body("email")
    .isEmail()
    .notEmpty()
    .withMessage("email is not valid."),

    body("password")
    .notEmpty()
    .isString()
    .isLength({min:8, max:20})
    .withMessage("Password must be in between 8 to 20 charecters.")
], tryCatch(adminController.adminRegister)
)

router.post(
    "/login", [
    body("email")
    .isEmail()
    .notEmpty()
    .withMessage("email is not valid."),

    body("password")
    .notEmpty()
    .isString()
    .isLength({min:8, max:20})
    .withMessage("Password must be in between 8 to 20 charecters.")
    ], 
    tryCatch(adminController.adminLogin)
);

router.get(
    "/profile", 
    isLoggedInAdmin, 
    tryCatch(adminController.getProfile)
)

router.post(
    "/logout",
    isLoggedInAdmin, 
    tryCatch(adminController.adminLogOut)
)

export default router;
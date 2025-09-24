import express from "express";
import  tryCatch  from "../utils/tryCatch.js";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import isLoggedInUser from "../middlewares/user.middleware.js"
const router = express.Router();

router.post(
  "/register",
  [
    body("firstName")
      .isString()
      .notEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("First name must be between 2 to 20 characters"),

    body("lastName")
      .isString()
      .notEmpty()
      .isLength({ min: 2, max: 20 })
      .withMessage("Last name must be between 2 to 20 characters"),

    body("number")
      .isMobilePhone("any")
      .isLength({ min: 10, max: 10 })
      .withMessage("Number must be exactly 10 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Number must contain only digits"),

    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
    .notEmpty()
    .isString()
    .isLength({min:8, max:20})
    .withMessage("Password must be in between 8 to 20 charecters."),

    body("altnumber")
      .optional({ checkFalsy: true })
      .isMobilePhone("any")
      .isLength({ min: 10, max: 10 })
      .withMessage("Alternate number must be exactly 10 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Alternate number must contain only digits"),

    body("pinCode")
      .optional({ checkFalsy: true })
      .isLength({ min: 6, max: 6 })
      .withMessage("Pincode must be exactly 6 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Pincode must contain only digits"),

    body("address")
      .optional({ checkFalsy: true })
      .isString()
      .notEmpty()
      .isLength({ min: 2, max: 30 })
      .withMessage("Address must be between 2 to 30 characters"),
  ],
  tryCatch(userController.userRegister)
);

router.post(
  "/login",
  [
    body("identifier")
    .notEmpty()
    .withMessage("Email or phone is required")
    .custom((value)=>{
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
        if(emailRegex.test(value) || phoneRegex.test(value)){
          return true;
        }
        throw new Error("Must be a valid email or Phone")
    }),

    body("password")
    .notEmpty()
    .isString()
    .isLength({min:8, max:20})
    .withMessage("Password must be in between 8 to 20 charecters.")
  ],
  tryCatch(userController.userLogin)
);

router.post(
  "/verify-otp",
  [
    body("email")
    .isEmail()
    .withMessage("Something went wrong try again."),

    body("otp")
    .notEmpty()
    .isString()
    .isLength({min: 6, max:6})
    .withMessage("Enter a valid OTP")
  ],
  tryCatch(userController.verifyOtp)
)

router.get(
  "/profile",
  isLoggedInUser,
  tryCatch(userController.getProfile)
)

router.post(
  "/logout",
  isLoggedInUser,
  tryCatch(userController.logOut)
)

router.post(
  "/add-product-in-cart",
  isLoggedInUser,
  tryCatch(userController.addProductInCart)
)


export default router;

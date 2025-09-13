import express from "express";
import  tryCatch  from "../utils/tryCatch.js";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
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
      .isString()
      .isLength({ min: 10, max: 10 })
      .withMessage("Number must be exactly 10 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Number must contain only digits"),

    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("altnumber")
      .optional()
      .isString()
      .isLength({ min: 10, max: 10 })
      .withMessage("Alternate number must be exactly 10 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Alternate number must contain only digits"),

    body("pinCode")
      .isString()
      .isLength({ min: 6, max: 6 })
      .withMessage("Pincode must be exactly 6 digits")
      .matches(/^[0-9]+$/)
      .withMessage("Pincode must contain only digits"),

    body("address")
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
    body("email")
      .notEmpty()
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
    .notEmpty()
    .isLength({min: 8, max: 16})
    
  ]
)


export default router;
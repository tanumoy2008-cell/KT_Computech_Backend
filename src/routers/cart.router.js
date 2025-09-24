import express from "express";
const router = express.Router();
import * as cartController from "../controllers/cart.controller.js";
import isLoggedInUser from "../middlewares/user.middleware.js";
import tryCatch from "../utils/tryCatch.js";

router.post(
  "/add-product-in-cart",
  isLoggedInUser,
  tryCatch(cartController.addProductInCart)
)

router.get(
  "/send-cart-info",
  isLoggedInUser,
  tryCatch(cartController.cartInfo)
)

router.post(
  "/increase-quantity",
  isLoggedInUser,
  tryCatch(cartController.addQuantityOfPerticularProduct)
)

router.post(
  "/decrease-quantity",
  isLoggedInUser,
  tryCatch(cartController.reduceQuantityOfPerticularProduct)
)

export default router;
import express from "express";
import isLoggedInAdmin from "../middlewares/admin.middleware.js"
import tryCatch from "../utils/tryCatch.js"
import * as productController from "../controllers/product.controllers.js"
import multer from "multer"
const router = express.Router()
const upload = multer();

router.post("/add", isLoggedInAdmin, upload.single("avatar"), tryCatch(productController.productAdd))
router.get("/top-product", tryCatch(productController.sendTopProduct))
router.get("/productDetails", isLoggedInAdmin, tryCatch(productController.productDetsSender))
router.get("/productSend", tryCatch(productController.productSendWithLimit))
router.get("/productDetail/:id", tryCatch(productController.product))
router.get("/product-info/:id", isLoggedInAdmin, tryCatch(productController.productInfo))
router.get("/product-count", isLoggedInAdmin, tryCatch(productController.productCount))
router.patch("/click/:id", tryCatch(productController.clickOnProduct))
router.patch("/product-update", isLoggedInAdmin, upload.single("avatar"), tryCatch(productController.productUpdate))
router.delete("/product-delete/:id", isLoggedInAdmin, tryCatch(productController.productDelete))
export default router;
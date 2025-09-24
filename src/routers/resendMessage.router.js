import express from "express";
import tryCatch from "../utils/tryCatch.js";
import sendMessageToKT from "../controllers/message.controller.js";
const router = express.Router();

router.post(
    "/message-send",
    tryCatch(sendMessageToKT)
);

export default router;
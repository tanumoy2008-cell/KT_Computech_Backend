import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import userRouter from "./src/routers/user.router.js";
import adminRouter from "./src/routers/admin.router.js";
import productRouter from "./src/routers/product.router.js";
import paymentRouter from "./src/routers/payment.router.js";
import connectionWithRetry from "./src/db/mongoose.connection.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 Blocked CORS request from: ${origin}`);
        callback(new Error("CORS not allowed for this origin"), false);
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(helmet());

connectionWithRetry();

app.get("/", (req,res)=>{
    res.status(200).send("Health Check")
})

app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/product", productRouter)
app.use("/api/payment", paymentRouter)

const Port = process.env.PORT || 3000;

app.listen(Port, ()=>{
    console.log(`KT Computech Backend running on ${Port}`)
})
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import imageRoutes from "./routes/image.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("mongodo is connected");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/image", imageRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

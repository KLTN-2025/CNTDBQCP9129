import express from 'express'
import dotenv from 'dotenv';
import cors from "cors";
import { connectDB } from './config/db.js';
import authRouter from './router/auth.router.js'

dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});

import express from 'express'
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import accountRouter from './router/account.router.js'

dotenv.config()
const app = express();
app.use(express.json());
app.use("/api/account", accountRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});

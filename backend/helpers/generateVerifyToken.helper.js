import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const generateVerifyToken = (payload) => {
  const { expiresIn, ...data } = payload;
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn });
};
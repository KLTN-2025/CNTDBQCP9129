import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
export const generateToken = (user) => {
  console.log(user);
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
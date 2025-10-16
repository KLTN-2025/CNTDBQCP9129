// middlewares/verifyToken.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token hoặc token không hợp lệ" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // gắn thông tin user vào req để controller dùng
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
};

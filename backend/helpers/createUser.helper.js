import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const createUserHelper = async ({ name, email, password }) => {
  // Kiểm tra email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã được sử dụng");
  }
  // Mã hóa mật khẩu
  const hashed = await bcrypt.hash(password, 10);
  // Tạo user mới
  const user = new User({ name, email, password: hashed });
  await user.save();
  return user;
};

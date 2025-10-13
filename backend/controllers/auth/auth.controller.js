import { generateToken } from "../../utils/jwt.js";
import { createUserHelper } from "../../helpers/createUser.helper.js";
import User from "../../model/user.model.js";
import bcrypt from "bcryptjs";
// Đăng kí
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUserHelper({ name, email, password });
    const token = generateToken({
      id: user._id,
      name: user.name,
      role: user.role,
    });
    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: user._id, name: user.name, email: user.email },
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Đăng nhập
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }
    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }
    const token = generateToken({id: user._id, name: user.name, role: user.role});
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

import { generateToken } from "../../utils/jwt.util.js";
import { createUserHelper } from "../../helpers/createUser.helper.js";
import User from "../../model/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; 
dotenv.config();

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
    const token = generateToken({
      id: user._id,
      name: user.name,
      role: user.role,
    });
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

// Quên mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Đặt lại mật khẩu - CoffeeGo",
      html: `
        <p>Xin chào <b>${user.name}</b>,</p>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Bấm vào liên kết bên dưới để tiếp tục:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p><i>Liên kết này sẽ hết hạn sau 10 phút.</i></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({
      message: "Vui lòng kiểm tra email để đặt lại mật khẩu",
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong database
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "email không tồn tại" });

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

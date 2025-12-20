import { generateVerifyToken } from "../../helpers/generateVerifyToken.helper.js";
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
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return res
        .status(400)
        .json({ message: "Tên không được chứa số hoặc ký tự đặc biệt" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (!password || password.trim().length < 8) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }
    const verifyToken = generateVerifyToken({
      name,
      email,
      password,
      expiresIn: "15m",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `http://localhost:5173/account/verify-email?token=${verifyToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực tài khoản - CoffeeGo",
      html: `
        <p>Xin chào <b>${name}</b>,</p>
        <p>Bấm vào liên kết dưới đây để xác thực email của bạn:</p>
        <a href="${verifyLink}" target="_blank">${verifyLink}</a>
        <p><i>Liên kết sẽ hết hạn sau 15 phút.</i></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư của bạn!",
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
    const token = generateVerifyToken({
      id: user._id,
      name: user.name,
      role: user.role,
      expiresIn: "1d",
    });
    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
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

    const resetToken = generateVerifyToken({
      id: user._id,
      email: user.email,
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetLink = `http://localhost:5173/account/reset-password?token=${resetToken}`;
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
    const { token } = req.query;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!newPassword || newPassword.trim().length < 8) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "email không tồn tại" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

//Xác thực tài khoản
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, email, password } = decoded;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Tài khoản đã được xác thực trước đó" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Xác thực email thành công. Tài khoản của bạn đã được tạo!",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

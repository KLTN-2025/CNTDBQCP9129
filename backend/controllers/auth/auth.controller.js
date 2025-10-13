import { generateToken } from "../../utils/jwt.js";
import { createUserHelper } from "../../helpers/createUser.helper.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await createUserHelper({ name, email, password });
    const token = generateToken({id: user._id, name: user.name, role: user.role});
    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: user._id, name: user.name, email: user.email },
      token: token
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

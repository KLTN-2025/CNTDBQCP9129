import { createUserHelper } from "../../helpers/createUser.helper.js";
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUserHelper({ name, email, password });
    res.status(201).json({
      message: "Thêm user thành công",
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import User from "../../model/user.model.js"
// Admin xem danh sách user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Admin cập nhật role 
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;   
    const { role } = req.body;      

    const validRoles = ["customer", "manager", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Giá trị role không hợp lệ" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json({ user: updatedUser,});
  } catch (error) {
    res.status(500).json({ message: "Lỗi server"});
  }
};

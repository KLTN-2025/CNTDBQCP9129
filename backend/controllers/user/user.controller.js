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
// Lấy tất cả user có role = manager
export const getManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" }).select("-password");
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Lấy tất cả user có role = admin
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
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

    // Lấy user hiện tại
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu user hiện tại là admin
    if (currentUser.role === "admin") {
      const countAdmins = await User.countDocuments({ role: "admin" });

      // Chỉ có 1 admin và đang định đổi role → cấm
      if (countAdmins === 1 && role !== "admin") {
        return res.status(400).json({
          message: "Không thể thay đổi vai trò. Hệ thống cần ít nhất 1 admin."
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};


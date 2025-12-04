// controllers/order.controller.js
import Order from "../../model/order.model.js";
// Lấy danh sách tất cả order (cho admin)
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Load 5 đơn mỗi lần
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("userId", "name email role")
      .populate("voucherId", "code") // Thêm populate voucherId
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({
      orders,
      hasMore: skip + orders.length < total,
      currentPage: page,
      totalOrders: total
    });
  } catch (err) {
    res.status(500).json({ message: "Lấy danh sách đơn hàng thất bại" });
  }
};
// Lấy order theo id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lấy dữ liệu đơn hàng thất bại" });
  }
};

// Cập nhật trạng thái order
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (req.io) {
      req.io.emit("orderUpdated", order);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// controllers/order.controller.js
import Order from "../../model/order.model.js";
// Lấy danh sách tất cả order (cho admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email role") // populate thông tin user 
      .sort({ createdAt: -1 });
    res.json(orders);
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


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
      .populate("voucherId", "code")
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

// Lấy danh sách order chưa thanh toán (PENDING)
export const getPendingOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ paymentStatus: "PENDING" })
      .populate("userId", "name email role")
      .populate("voucherId", "code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ paymentStatus: "PENDING" });

    res.json({
      orders,
      hasMore: skip + orders.length < total,
      currentPage: page,
      totalOrders: total
    });
  } catch (err) {
    res.status(500).json({ message: "Lấy danh sách đơn hàng chưa thanh toán thất bại" });
  }
};

// Lấy danh sách order đã thanh toán (SUCCESS)
export const getSuccessOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ paymentStatus: "SUCCESS" })
      .populate("userId", "name email role")
      .populate("voucherId", "code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ paymentStatus: "SUCCESS" });

    res.json({
      orders,
      hasMore: skip + orders.length < total,
      currentPage: page,
      totalOrders: total
    });
  } catch (err) {
    res.status(500).json({ message: "Lấy danh sách đơn hàng đã thanh toán thất bại" });
  }
};

// Lấy order theo id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lấy dữ liệu đơn hàng thất bại" });
  }
};

// Lấy tất cả order theo userId (cho khách hàng xem lịch sử đơn hàng)
export const getAllOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }
    const orders = await Order.find({ userId })
      .populate("voucherId", "code")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy danh sách đơn hàng" });
  }
};

// Cập nhật trạng thái order
export const completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (order.status !== "PROCESSING") {
      return res.status(400).json({ 
        message: "Chỉ có thể hoàn thành đơn hàng đang ở trạng thái 'Đang xử lý'" 
      });
    }

    if (order.paymentStatus !== "SUCCESS") {
      return res.status(400).json({ 
        message: "Chỉ có thể hoàn thành đơn hàng đã thanh toán thành công" 
      });
    }
    order.status = "COMPLETED";
    await order.save();
    const updatedOrder = await Order.findById(id)
      .populate("userId", "name email role")
      .populate("voucherId", "code");
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Xác nhận hoàn thành đơn hàng thất bại" });
    console.log(err);
  }
};
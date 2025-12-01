// controllers/order.controller.js
import Order from "../../model/order.model.js";

// Tạo order mới
export const createOrder = async (req, res) => {
  try {
    const { userId, items, delivery, orderType, paymentMethod, voucherId } = req.body;

    // Validate dữ liệu bắt buộc
    if (!delivery.name || !delivery.phone || !userId || !paymentMethod || !orderType) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Validate item
    const invalidItem = items.some(
      (item) =>
        !item.productId._id ||
        !item.productId.price ||
        !item.quantity ||
        !item.productId.name
    );
    if (invalidItem) {
      return res.status(400).json({ message: "Có sản phẩm thiếu dữ liệu bắt buộc" });
    }

    // Tính tổng tiền
    let total = items.reduce((sum, i) => sum + i.quantity * i.productId.price, 0);
    if (delivery.address) total += 20000;

    // Format items
    const itemsFormat = items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      quantity: item.quantity,
      price: item.productId.price,
      note: item.note || "",
    }));

    // Tạo order
    const order = await Order.create({
      userId,
      items: itemsFormat,
      totalPrice: total,
      delivery,
      orderType,
      paymentMethod,
      voucher: voucherId || null, 
    });

    if (req.io) {
      req.io.to("admin_room").emit("newOrder", order);
    }

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Tạo đơn hàng thất bại" });
  }
};

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

    // Emit realtime cho admin hoặc khách hàng
    if (req.io) {
      req.io.emit("orderUpdated", order);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật trạng thái thanh toán (VNPAY)
export const updatePaymentStatus = async (req, res) => {
  try {
    const {
      paymentStatus,
      vnp_TxnRef,
      vnp_TransactionNo,
      vnp_PayDate,
      vnp_Amount,
    } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, vnp_TxnRef, vnp_TransactionNo, vnp_PayDate, vnp_Amount },
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

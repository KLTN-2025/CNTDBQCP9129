// controllers/order.controller.js
import Order from "../../model/order.model.js";
import Recipe from "../../model/recipe.model.js";
import Ingredient from "../../model/ingredient.model.js";
// Tạo order mới
export const createOrderOnline = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { userId, items, delivery, orderType, paymentMethod, voucherId, vnpInfo } = req.body;

    // Validate dữ liệu bắt buộc
    if (!delivery.name || !delivery.phone || !userId || !paymentMethod || !orderType) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    if (!items || !items.length) {
      return res.status(400).json({ message: "Không có sản phẩm nào trong giỏ" });
    }

    // Format items + tính tổng tiền
    let total = 0;
    const itemsFormat = [];

    for (const item of items) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ message: "Sản phẩm hoặc số lượng không hợp lệ" });
      }
      total += item.quantity * (item.price || 0); // item.price từ frontend
      itemsFormat.push({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        note: item.note || "",
      });
    }

    if (delivery.address) total += 20000;

    // Bắt đầu transaction
    session.startTransaction();

    // Kiểm tra và trừ kho nguyên liệu theo công thức
    for (const item of items) {
      const recipe = await Recipe.findOne({ productId: item.productId }).session(session);
      if (!recipe) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Sản phẩm ${item.name} chưa có công thức` });
      }

      for (const r of recipe.items) {
        const requiredAmount = r.quantity * item.quantity;

        const updated = await Ingredient.updateOne(
          { _id: r.ingredientId, quantity: { $gte: requiredAmount }, status: true },
          { $inc: { quantity: -requiredAmount } },
          { session }
        );

        if (!updated.modifiedCount) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Nguyên liệu ${r.ingredientId} không đủ cho món ${item.name}`,
          });
        }
      }
    }

    // Tạo Order
    const order = await Order.create(
      [
        {
          userId,
          items: itemsFormat,
          totalPrice: total,
          delivery,
          orderType,
          paymentMethod,
          voucherId: voucherId || null,
          status: "PROCESSING",         // mặc định sau khi thanh toán thành công
          paymentStatus: "SUCCESS",
          vnp_TxnRef: vnpInfo?.vnp_TxnRef || null,
          vnp_TransactionNo: vnpInfo?.vnp_TransactionNo || null,
          vnp_PayDate: vnpInfo?.vnp_PayDate || null,
          vnp_Amount: vnpInfo?.vnp_Amount || null,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // Emit realtime cho admin
    if (req.io) {
      req.io.to("admin_room").emit("newOrder", order[0]);
    }

    res.status(201).json(order[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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

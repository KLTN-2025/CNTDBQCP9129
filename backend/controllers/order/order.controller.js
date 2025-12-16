import mongoose from "mongoose";
import Order from "../../model/order.model.js";
import Product from "../../model/product.model.js";
import Recipe from "../../model/recipe.model.js";
import Ingredient from "../../model/ingredient.model.js";
// Tạo orderOffline 
export const createOrderOffline = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, items, pagerNumber } = req.body;

    // VALIDATE
    if (!items || !items.length) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Danh sách món trống" });
    }

    if (!pagerNumber) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Thiếu số thẻ" });
    }

    // CHECK THẺ ĐANG DÙNG
    const pagerInUse = await Order.exists({
      pagerNumber,
      status: "PROCESSING",
    });

    if (pagerInUse) {
      await session.abortTransaction();
      return res.status(400).json({
        message: `Thẻ số ${pagerNumber} đang được sử dụng`,
      });
    }

    // BƯỚC 1: TÍNH TIỀN + CHUẨN HÓA ITEMS
    let total = 0;
    const detailedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.status === false) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Sản phẩm đã ngừng bán`,
        });
      }

      const price = product.price * (1 - product.discount / 100);
      const itemTotal = price * item.quantity;
      total += itemTotal;

      detailedItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
        note: item.note || "",
      });
    }

    total = Math.round(total);

    // BƯỚC 2: TRỪ KHO THEO CÔNG THỨC
    for (const item of detailedItems) {
      const recipe = await Recipe.findOne({
        productId: item.productId,
      }).session(session);

      if (!recipe) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Sản phẩm "${item.name}" chưa có công thức`,
        });
      }

      for (const r of recipe.items) {
        const requiredAmount = r.quantity * item.quantity;

        const ingredientAfterUpdate = await Ingredient.findOneAndUpdate(
          {
            _id: r.ingredientId,
            quantity: { $gte: requiredAmount },
            status: true,
          },
          { $inc: { quantity: -requiredAmount } },
          { new: true, session }
        );

        if (!ingredientAfterUpdate) {
          await session.abortTransaction();
          return res.status(400).json({
            message: "Kho không đủ nguyên liệu",
          });
        }
        // Auto tắt nếu hết
        if (ingredientAfterUpdate.quantity === 0) {
          ingredientAfterUpdate.status = false;
          await ingredientAfterUpdate.save({ session });
        }
      }
    }

    // BƯỚC 3: TẠO ORDER OFFLINE
    const newOrder = new Order({
      userId,
      items: detailedItems,
      totalPrice: total,
      orderType: "OFFLINE",
      paymentMethod: "CASH",
      paymentStatus: "SUCCESS",
      status: "PROCESSING",
      pagerNumber,
    });

    await newOrder.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Tạo đơn offline thành công",
      order: newOrder,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("CREATE OFFLINE ORDER ERROR:", err);
    res.status(500).json({
      message: "Tạo đơn offline thất bại",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};
// Lấy danh sách tất cả order (cho admin)
export const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20; // Load 20 đơn mỗi lần
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
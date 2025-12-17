import Order from "../../model/order.model.js";
import Product from "../../model/product.model.js";
import User from "../../model/user.model.js";
import Ingredient from "../../model/ingredient.model.js";
import Reservation from "../../model/reservation.model.js";

// Lấy thống kê tổng quan
export const getOverviewStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tổng doanh thu hôm nay
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
          paymentStatus: "SUCCESS",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Tổng đơn hàng hôm nay
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Tổng khách hàng
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Tổng sản phẩm đang bán
    const totalProducts = await Product.countDocuments({ status: true });

    // Đơn đang xử lý
    const processingOrders = await Order.countDocuments({
      status: "PROCESSING",
    });

    // Nguyên liệu sắp hết (quantity < 10)
    const lowStockIngredients = await Ingredient.countDocuments({
      quantity: { $lt: 10 },
      status: true,
    });

    // Đặt bàn hôm nay
    const todayReservations = await Reservation.countDocuments({
      reservationDate: {
        $gte: today.toISOString().split("T")[0],
        $lt: tomorrow.toISOString().split("T")[0],
      },
    });

    res.json({
      todayRevenue: todayRevenue[0]?.total || 0,
      todayOrders,
      totalCustomers,
      totalProducts,
      processingOrders,
      lowStockIngredients,
      todayReservations,
    });
  } catch (error) {
    console.error("GET OVERVIEW STATS ERROR:", error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê tổng quan" });
  }
};

// Lấy doanh thu theo khoảng thời gian
export const getRevenueStats = async (req, res) => {
  try {
    const { period = "day", startDate, endDate } = req.query;

    let start, end, groupFormat;

    if (startDate && endDate) {
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (period) {
        case "day": // 7 ngày gần nhất
          start = new Date(today);
          start.setDate(start.getDate() - 6);
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          groupFormat = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          };
          break;

        case "week": // 4 tuần gần nhất
          start = new Date(today);
          start.setDate(start.getDate() - 27);
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          groupFormat = {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          };
          break;

        case "month": // 6 tháng gần nhất
          start = new Date(today);
          start.setMonth(start.getMonth() - 5);
          start.setDate(1);
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          groupFormat = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          };
          break;

        case "quarter": // 4 quý gần nhất
          const currentQuarter = Math.floor(today.getMonth() / 3);
          start = new Date(today.getFullYear() - 1, currentQuarter * 3, 1);
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          groupFormat = {
            year: { $year: "$createdAt" },
            quarter: {
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
            },
          };
          break;

        default:
          start = new Date(today);
          start.setDate(start.getDate() - 6);
          end = new Date(today);
          end.setHours(23, 59, 59, 999);
          groupFormat = {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          };
      }
    }

    // Aggregate revenue
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "SUCCESS",
        },
      },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({
      period,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      data: revenueData,
    });
  } catch (error) {
    console.error("GET REVENUE STATS ERROR:", error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê doanh thu" });
  }
};

// Top sản phẩm bán chạy
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "SUCCESS" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy top sản phẩm" });
  }
};

// Thống kê theo loại đơn hàng (ONLINE vs OFFLINE)
export const getOrderTypeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    }

    const orderTypeStats = await Order.aggregate([
      { $match: { paymentStatus: "SUCCESS", ...dateFilter } },
      {
        $group: {
          _id: "$orderType",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(orderTypeStats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê loại đơn hàng" });
  }
};

// Thống kê trạng thái đơn hàng
export const getOrderStatusStats = async (req, res) => {
  try {
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(statusStats);
  } catch (error) {
    console.error("GET ORDER STATUS STATS ERROR:", error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê trạng thái" });
  }
};
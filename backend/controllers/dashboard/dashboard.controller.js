import Order from "../../model/order.model.js";
import Product from "../../model/product.model.js";
import User from "../../model/user.model.js";
import Ingredient from "../../model/ingredient.model.js";
import Reservation from "../../model/reservation.model.js";

// Lấy thống kê tổng quan
export const getOverviewStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let start, end;
    
    if (startDate && endDate) {
      // Nếu có filter ngày
      start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // Mặc định hôm nay
      start = new Date();
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
    }

    // Thống kê tháng này
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Doanh thu theo khoảng thời gian được chọn
    const periodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: "SUCCESS",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Đơn hàng theo khoảng thời gian được chọn
    const periodOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
      paymentStatus: "SUCCESS",
    });

    // Doanh thu tháng này
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
          paymentStatus: "SUCCESS",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Tổng đơn hàng tháng này
    const monthOrders = await Order.countDocuments({
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
      paymentStatus: "SUCCESS",
    });

    // Tổng doanh thu TỔNG
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "SUCCESS",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    // Tổng đơn hàng ALL TIME
    const totalOrders = await Order.countDocuments({
      paymentStatus: "SUCCESS",
    });

    // Tổng khách hàng
    const totalCustomers = await User.countDocuments({ role: "customer" });
    // Tổng nhân viên
    const totalManager = await User.countDocuments({ role: "manager" });
    // Tổng admin
    const totalAdmin = await User.countDocuments({ role: "admin" });
    // Tổng sản phẩm đang bán
    const totalProducts = await Product.countDocuments({ status: true });
    // Tổng sản phẩm đang hết hàng
    const outOfStockProducts = await Product.countDocuments({
      status: false,
    });
    // Đơn đang xử lý
    const processingOrders = await Order.countDocuments({
      status: "PROCESSING",
    });

    // Nguyên liệu sắp hết (quantity <= 500)
    const lowStockIngredients = await Ingredient.countDocuments({
      $or: [
        {
          unit: "cái",
          quantity: { $lte: 100 },
        },
        {
          unit: { $in: ["g", "ml"] },
          quantity: { $lte: 500 },
        },
      ],
    });
    // Tính % tăng trưởng so với tháng trước
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
    
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
          paymentStatus: "SUCCESS",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenueGrowth = lastMonthRevenue[0]?.total 
      ? (((monthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(1)
      : 0;

    res.json({
      // Theo khoảng thời gian được chọn (hoặc hôm nay)
      periodRevenue: periodRevenue[0]?.total || 0,
      periodOrders,
      periodStart: start.toISOString().split("T")[0],
      periodEnd: end.toISOString().split("T")[0],
      
      // Tháng này
      monthRevenue: monthRevenue[0]?.total || 0,
      monthOrders,
      revenueGrowth: parseFloat(revenueGrowth),
      
      // Tổng thể
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalManager,
      totalAdmin,
      totalProducts,
      processingOrders,
      lowStockIngredients,
      outOfStockProducts,
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
      
      // Tự động xác định groupFormat dựa vào khoảng thời gian
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 31) {
        // <= 1 tháng: group theo ngày
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
      } else if (daysDiff <= 90) {
        // <= 3 tháng: group theo tuần
        groupFormat = {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" },
        };
      } else {
        // > 3 tháng: group theo tháng
        groupFormat = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
      }
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
    res.status(500).json({ message: "Lỗi khi lấy thống kê doanh thu" });
  }
};

// Top sản phẩm bán chạy
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 5, startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    }

    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "SUCCESS", ...dateFilter } },
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
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    }

    const statusStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(statusStats);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê trạng thái" });
  }
};
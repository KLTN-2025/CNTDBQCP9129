import Voucher from "../../model/voucher.model.js";
import Order from "../../model/order.model.js"; 

// Tạo voucher
export const createVoucher = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      image,
      usageLimit,
      perUserLimit = 1,
      applicableCategories = [],
      minOrderValue = 0,
      maxDiscountAmount = 0,
    } = req.body;

    // Check code đã tồn tại chưa
    const exist = await Voucher.findOne({ code });
    if (exist) return res.status(400).json({ message: "Mã voucher đã tồn tại" });
    if(!description || !discountValue || !image || !usageLimit) return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    const voucher = new Voucher({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      image,
      conditions: {
        minOrderValue,
        applicableCategories,
        maxDiscountAmount,
      },
    });

    await voucher.save();
    res.status(201).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách voucher
export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "conditions.applicableCategories",
        select: "name",        
      });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Áp dụng voucher
export const applyVoucher = async (req, res) => {
  try {
    const { voucherCode, items, total, userId } = req.body;

    // Lấy voucher
    const voucher = await Voucher.findOne({ code: voucherCode });
    if (!voucher) return res.status(400).json({ message: "Voucher không tồn tại" });

    // Check trạng thái
    if (voucher.status !== "active") return res.status(400).json({ message: "Voucher không khả dụng" });

    // Check thời gian
    const now = new Date();
    const start = new Date(voucher.startDate);
    const end = new Date(voucher.endDate);
    if (now < start || now > end) return res.status(400).json({ message: "Voucher chưa đến hạn hoặc đã hết hạn" });

    // Check minOrderValue
    if (total < voucher.conditions.minOrderValue) return res.status(400).json({ message: "Đơn hàng chưa đủ điều kiện voucher" });

    // Check perUserLimit
    const usedCount = await Order.countDocuments({ userId, voucherCode });
    if (usedCount >= voucher.perUserLimit) return res.status(400).json({ message: "Bạn đã dùng voucher này rồi" });

    // Check applicableCategories
    if(voucher.conditions.applicableCategories > 0){
      const allItemsMatch = items.every(item => voucher.conditions.applicableCategories.includes(item.category));
      if (!allItemsMatch) {
        return res.status(400).json({ message: "Voucher chỉ áp dụng hóa đơn có tất cả sản phẩm trong danh mục" });
      }
    }

    // Tính discount
    let discount = 0;
    if (voucher.discountType === "percent") {
      discount = total * (voucher.discountValue / 100);
      if (voucher.conditions.maxDiscountAmount > 0) {
        discount = Math.min(discount, voucher.conditions.maxDiscountAmount);
      }
    } else {
      discount = voucher.discountValue;
      discount = Math.min(discount, total);
    }
    res.json({ discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

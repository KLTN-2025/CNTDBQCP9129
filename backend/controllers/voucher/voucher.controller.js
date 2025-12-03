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
      perUserLimit,
      applicableCategories = [],
      minOrderValue,
      maxDiscountAmount,
    } = req.body;

    // Kiểm tra mã đã tồn tại
    if (await Voucher.findOne({ code })) {
      return res.status(400).json({ message: "Mã voucher đã tồn tại" });
    }
    // Check các trường bắt buộc
    const requiredFields = {
      code: code?.trim(),
      description: description?.trim(),
      discountType: discountType?.trim(),
      image: image?.trim(),
      discountValue,
      startDate,
      endDate,
      usageLimit,
      perUserLimit,
      minOrderValue,
    };

    for (const value of Object.values(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return res.status(400).json({
          message: "Thiếu thông tin bắt buộc hoặc thông tin chưa hợp lệ",
        });
      }
    }
    const codeRegex = /^[a-zA-Z0-9_-]{6,20}$/;
    if (!codeRegex.test(code)) {
      return res.status(400).json({
        message:
          "Mã voucher phải từ 6 đến 20 ký tự, không được chứa dấu hoặc ký tự đặc biệt",
      });
    }
    // check số liệu
    if (discountValue <= 0)
      return res.status(400).json({
        message: "Giá trị khuyến mãi phải lớn hơn 0",
      });

    if (usageLimit <= 0)
      return res.status(400).json({
        message: "Số lượng mã phải lớn hơn 0",
      });

    if (perUserLimit <= 0)
      return res.status(400).json({
        message: "Số lần sử dụng tối đa mỗi tài khoản phải lớn hơn 0",
      });

    if (usageLimit < perUserLimit)
      return res.status(400).json({
        message:
          "Số lần sử dụng tối đa mỗi tài khoản không được lớn hơn số lượng mã",
      });

    if (minOrderValue < 0)
      return res.status(400).json({
        message: "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0",
      });

    if (maxDiscountAmount != null && maxDiscountAmount <= 0)
      return res.status(400).json({
        message: "Giá trị giảm tối đa phải lớn hơn",
      });

    // check loại discount
    if (discountType === "percent") {
      if (discountValue <= 0 || discountValue > 100) {
        return res.status(400).json({
          message: "Giảm phần trăm phải từ 1 đến 100",
        });
      }
    }
    // check thời gian
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    // So sánh ngày giờ
    if (start >= end)
      return res
        .status(400)
        .json({ message: "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc" });
    if (end <= now)
      return res
        .status(400)
        .json({ message: "Thời gian kết thúc phải lớn hơn hiện tại" });

    // Tạo voucher
    const voucher = new Voucher({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      startDate: start,
      endDate: end,
      image,
      usageLimit,
      perUserLimit,
      conditions: {
        minOrderValue,
        applicableCategories,
        maxDiscountAmount,
      },
    });

    await voucher.save();
    const populatedVoucher = await Voucher.findById(voucher._id).populate(
      "conditions.applicableCategories",
      "name"
    );
    return res.status(201).json(populatedVoucher);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách voucher
export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort({ createdAt: -1 }).populate({
      path: "conditions.applicableCategories",
      select: "name",
    });
    const now = new Date();
    const result = vouchers.map((v) => {
      let status = v.status;
      if (v.status === "inactive") status = "inactive";
      else if (now < v.startDate) status = "upcoming";
      else if (now > v.endDate) status = "expired";
      else status = "active";

      return { ...v.toObject(), status };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Áp dụng voucher
export const applyVoucher = async (req, res) => {
  try {
    const { voucherCode, items, total, userId } = req.body;
    const { discount } = await calculateVoucherDiscount({ voucherCode, items, total, userId });
    res.json({voucherCode, discount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Hàm tính discount của voucher
export const calculateVoucherDiscount = async ({ voucherCode, items, total, userId }) => {
  const voucher = await Voucher.findOne({ code: voucherCode });
  if (!voucher) throw new Error("Voucher không tồn tại");
  if (voucher.status !== "active") throw new Error("Voucher không khả dụng");
  console.log(items);
  const now = new Date();
  if (now < new Date(voucher.startDate)) throw new Error("Voucher chưa đến hạn");
  if (now > new Date(voucher.endDate)) throw new Error("Voucher đã hết hạn");

  if (total < voucher.conditions.minOrderValue)
    throw new Error("Đơn hàng chưa đủ điều kiện voucher");

  const usedCount = await Order.countDocuments({ userId, voucherCode });
  if (usedCount >= voucher.perUserLimit) throw new Error("Bạn đã hết lượt dùng cho voucher này");

  if (voucher.conditions.applicableCategories.length > 0) {
    const allItemsMatch = items.every(productCategoryId =>
      voucher.conditions.applicableCategories.includes(productCategoryId)
    );
    if (!allItemsMatch) throw new Error(
      "Có sản phẩm không thuộc trong danh mục khuyến mãi của voucher"
    );
  }

  let discount = 0;
  if (voucher.discountType === "percent") {
    discount = total * (voucher.discountValue / 100);
    if (voucher.conditions.maxDiscountAmount != null && voucher.conditions.maxDiscountAmount > 0) {
      discount = Math.min(discount, voucher.conditions.maxDiscountAmount);
    }
    discount = Math.min(discount, total);
  } else {
    discount = Math.min(voucher.discountValue, total);
  }

  return { voucherId: voucher._id, voucherCode, discount};
};

export const getAvailableVouchers = async (req, res) => {
  try {
    const now = new Date();

    const vouchers = await Voucher.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
      status: { $ne: "inactive" },
      $expr: { $lt: ["$usedCount", "$usageLimit"] } 
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "conditions.applicableCategories",
        select: "name",
      });

    return res.json(vouchers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deactivateVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    // Nếu đã inactive thì không cần update
    if (voucher.status === "inactive") {
      return res.status(400).json({ message: "Voucher đã bị vô hiệu hóa" });
    }
    // Cập nhật status
    voucher.status = "inactive";
    await voucher.save();

    return res.json(voucher);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }
    if (voucher.usedCount > 0) {
      return res.status(400).json({
        message: `Voucher đã được sử dụng ${voucher.usedCount} lần, không thể xóa`,
      });
    }
    await Voucher.findByIdAndDelete(id);
    return res.json({ message: "Xóa voucher thành công" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

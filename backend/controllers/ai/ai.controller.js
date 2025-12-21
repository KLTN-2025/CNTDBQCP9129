import { chatWithGemini } from "../../services/gemini.service.js";
import Product from "../../model/product.model.js";
import Order from "../../model/order.model.js";
import { ruleBasedAnswer } from "../../services/rule.service.js";
export const chatAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Bạn cần mình tư vấn gì nè? 😅" });
    }
    const ruleReply = ruleBasedAnswer(message);
    if (ruleReply) {
      return res.json({ reply: ruleReply });
    }
    // Dựa trên lịch sử đơn hàng đã thanh toán thành công
    const topSellingData = await Order.aggregate([
      { $match: { paymentStatus: "SUCCESS" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    // Lấy ra danh sách ID của các món bán chạy
    const bestSellerIds = topSellingData.map((item) => item._id.toString());

    // lấy toàn bộ menu đang bán
    const products = await Product.find({ status: true }).select(
      "name price discount description _id"
    );

    const processedMenu = products.map((p) => {
      const finalPrice = Math.round(p.price * (1 - (p.discount || 0) / 100));

      return {
        name: p.name,
        description: p.description,
        originalPrice: p.price.toLocaleString("vi-VN"),
        discount: p.discount,
        finalPrice: finalPrice.toLocaleString("vi-VN"),
        isBestSeller: bestSellerIds.includes(p._id.toString()),
      };
    });

    // Tạo danh sách tên Best Seller
    const bestSellerNames = processedMenu
      .filter((p) => p.isBestSeller)
      .map((p) => p.name);

    // Truyền tin nhắn + Menu đã xử lý giá + Danh sách Best Seller
    const reply = await chatWithGemini(message, processedMenu, bestSellerNames);

    return res.json({ reply });
  } catch (err) {
    console.error("chat bot error: ", err);
    return res.json({
      reply: "Hệ thống đang bận xíu, bạn thử lại sau nhé! 🙏",
    });
  }
};

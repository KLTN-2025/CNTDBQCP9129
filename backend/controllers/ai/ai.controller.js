import { analyzeMessage } from "../../services/gemini.service.js";
import { ruleBasedAnswer } from "../../services/rule.service.js";
import Product from "../../model/product.model.js";

export const chatAI = async (req, res) => {
  try {
    const { message } = req.body;

    // RULE-BASED (FREE)
    const ruleReply = ruleBasedAnswer(message);
    if (ruleReply) {
      return res.json({ reply: ruleReply });
    }

    // AI PHÂN TÍCH
    const { intent, product } = await analyzeMessage(message);

    // BACKEND XỬ LÝ
    switch (intent) {
      case "ASK_PRICE": {
        if (!product) {
          return res.json({
            reply: "Bạn muốn hỏi giá món nào ạ?",
          });
        }

        // tìm các món có tên chứa product
        const items = await Product.find({
          name: new RegExp(product, "i"),
        });

        if (!items.length) {
          return res.json({
            reply: "Quán chưa có món này 😥",
          });
        }

        if (items.length > 1) {
          const list = items
            .map((item, index) => `${index + 1}. ${item.name}`)
            .join("\n");

          return res.json({
            reply: `Quán có các món sau:\n${list}\n👉 Bạn điền tên cụ thể mình trả lời nhé`,
            options: items.map((i) => i.name),
          });
        }

        return res.json({
          reply: `${items[0].name} có giá ${items[0].price.toLocaleString()}đ`,
        });
      }

      case "ASK_RECOMMEND":
        return res.json({
          reply: "Mình gợi ý Latte hoặc Americano nha ☕",
        });
      case "DESCRIBE_PRODUCT": {
        if (!product) {
          return res.json({
            reply: "Bạn muốn mình mô tả món nào ạ?",
          });
        }

        const items = await Product.find({
          name: new RegExp(product, "i"),
        });

        if (!items.length) {
          return res.json({
            reply: "Món này quán mình chưa có 😥",
          });
        }

        // nhiều món -> cho chọn
        if (items.length > 1) {
          const list = items
            .map((item, i) => `${i + 1}. ${item.name}`)
            .join("\n");

          return res.json({
            reply: `Quán có các món sau:\n${list}\n👉 Bạn muốn mình mô tả món nào?`,
            options: items.map((i) => i.name),
          });
        }

        // 1 món -> mô tả
        return res.json({
          reply:
            items[0].description ||
            `${items[0].name} là món cà phê được nhiều khách yêu thích ☕`,
        });
      }
      default:
        return res.json({
          reply: "Mình chưa hiểu câu hỏi của bạn 😅",
        });
    }
  } catch (err) {
    console.error("CHAT AI ERROR >>>", err);
    return res.json({
      reply: "AI đang bận, bạn thử lại sau nhé 🙏",
    });
  }
};

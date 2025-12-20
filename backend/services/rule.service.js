import { normalizeText } from "../utils/normalizeText.utils.js"; 
export const ruleBasedAnswer = (message) => {
  const text = normalizeText(message);

  if (
    text.includes("gio mo cua") ||
    text.includes("mo may gio") ||
    text.includes("dong may gio")
  ) {
    return "Coffee Go mở cửa từ 8h đến 23h mỗi ngày. Bạn hãy đến quán trải nghiệm nhé! ☕";
  }

  if (
    text.includes("quan co ship") ||
    text.includes("co ship") ||
    text.includes("ship khong")
  ) {
    return "Coffee Go có ship trong bán kính 10km quanh quận Hải Châu, phí ship 20k nha 🚚";
  }

  if (
    text.includes("khuyen mai") ||
    text.includes("sale") ||
    text.includes("giam gia")
  ) {
    return "Coffee Go đang có nhiều voucher hấp dẫn, bạn xem ở mục Thực đơn nha 🎁";
  }

  if (
    text.includes("tuyen dung") ||
    text.includes("nhan vien") ||
    text.includes("viec lam")
  ) {
    return "Hiện tại Coffee Go chưa tuyển dụng, tụi mình sẽ cập nhật ở trang Tin tức nhé 🙏";
  }

  if (
    text.includes("dia chi") ||
    text.includes("o dau") ||
    text.includes("cho nao")
  ) {
    return "Coffee Go ở 12 Bạch Đằng, quận Hải Châu, Đà Nẵng 📍";
  }

  if (["hi", "hello", "xin chao"].includes(text)) {
    return "Chào bạn 👋 Coffee Go có thể giúp gì cho bạn nè?";
  }

  if (["cam on", "ok", "oke"].includes(text)) {
    return "Rất vui được hỗ trợ bạn ☕ Có gì cần cứ quay lại hỏi mình nhé!";
  }

  return null;
};

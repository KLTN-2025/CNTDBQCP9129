export const ruleBasedAnswer = (message) => {
  const text = message.toLowerCase();
  // giờ mở cửa
  if (
    text.includes("giờ mở cửa") ||
    text.includes("mở mấy giờ") ||
    text.includes("đóng mấy giờ")
  ) {
    return "Coffee Go mở cửa từ 8h đến 23h mỗi ngày. Bạn hãy đến quán trải nghiệm nhé!";
  }
  // ship
  if (
    text.includes("quán có ship") ||
    text.includes("mày có ship") ||
    text.includes("ship không")
  ) {
    return "Coffee Go có ship ạ bán kính 10km quanh khu vực quận Hải Châu ạ. Phí ship là 20k nha";
  }
  // khuyến mãi
  if (
    text.includes("Khuyến mãi") ||
    text.includes("sale") ||
    text.includes("giảm giá")
  ) {
    return "Coffee Go đang có những voucher hấp dẫn bạn lấy mã ở mục thực đơn nha";
  }
  // tuyển dụng
  if (
    text.includes("nhân viên") ||
    text.includes("tuyển dụng") ||
    text.includes("việc làm")
  ) {
    return "Coffee Go hiện tại chưa tuyển người. Mọi thông tin chúng tôi sẽ cập nhật ở trang tin tức";
  }

  // địa chỉ
  if (
    text.includes("địa chỉ") ||
    text.includes("ở đâu") ||
    text.includes("chỗ nào")
  ) {
    return "Coffee Go ở 12 Bạch Đằng, quận Hải Châu, thành phố Đà Nẵng";
  }

  // chào hỏi
  if (["hi", "hello", "xin chào"].includes(text)) {
    return "Chào bạn 👋 Mình có thể giúp gì cho bạn?";
  }
  // tạm biệt
  if (["cảm ơn", "ok", "oke"].includes(text)) {
    return "Tạm biệt. Bạn thắc mắc gì cứ hỏi mình nhé!?";
  }

  // không match
  return null;
};

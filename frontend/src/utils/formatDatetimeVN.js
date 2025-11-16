export const formatDatetimeVN = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,             // 24h format
    timeZone: "Asia/Ho_Chi_Minh" // giờ Việt Nam
  };

  // trả về dạng dd/mm/yyyy, hh:mm
  return date.toLocaleString("vi-VN", options);
};
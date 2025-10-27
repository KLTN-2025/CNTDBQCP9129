// utils/formatDate.js
export const formatDatetimeVN = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,       // 24h format
    timeZone: "Asia/Ho_Chi_Minh", // múi giờ Việt Nam
  };

  return date.toLocaleString("vi-VN", options);
};

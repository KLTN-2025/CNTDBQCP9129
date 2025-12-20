export const formatDatetimeVN = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,           
    timeZone: "Asia/Ho_Chi_Minh" 
  };

  return date.toLocaleString("vi-VN", options);
};
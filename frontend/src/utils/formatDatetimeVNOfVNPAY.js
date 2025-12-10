export const formatDatetimeVNOfVNPAY = (vnpDateString) => {
  if (!vnpDateString) return "";

  // vnpDateString dạng: YYYYMMDDHHmmss
  const year = vnpDateString.substring(0, 4);
  const month = vnpDateString.substring(4, 6);
  const day = vnpDateString.substring(6, 8);
  const hour = vnpDateString.substring(8, 10);
  const minute = vnpDateString.substring(10, 12);
  const second = vnpDateString.substring(12, 14);

  // Ghép thành chuẩn ISO
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}+07:00`;

  const date = new Date(iso);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

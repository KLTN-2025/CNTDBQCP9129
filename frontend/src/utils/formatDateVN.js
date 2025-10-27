export function formatDateVN(date) {
  if (!date) return "";

  const d = new Date(date); // đảm bảo là Date object
  const day = d.getDate().toString().padStart(2, "0"); // ngày với 2 chữ số
  const month = (d.getMonth() + 1).toString().padStart(2, "0"); // tháng từ 01 đến 12
  const year = d.getFullYear();

  return `${day} Tháng ${month}, ${year}`;
}

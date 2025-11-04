export const formatCurrencyVN = (price) => {
  if (!price && price !== 0) return "";
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

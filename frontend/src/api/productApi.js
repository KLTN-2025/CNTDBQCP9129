import axiosClient from "./axiosClient";

const productApi = {
  // Tạo product mới
  create: async (data) => {
    const res = await axiosClient.post("/products", data);
    return res.data;
  },

  getLimitedProducts: async () => {
    const res = await axiosClient.get("/products/limit");
    return res.data;
  },
  getAllProducts: async () => {
    const res = await axiosClient.get("/products");
    return res.data
  },
  // Lấy products theo category slug
  getByCategory: async (slugCategory) => {
    const res = await axiosClient.get(`/products/${slugCategory}`);
    return res.data;
  },

  // Cập nhật product theo ID
  update: async (id, data) => {
    const res = await axiosClient.put(`/products/${id}`, data);
    return res.data;
  },

  // Xóa product theo ID
  delete: async (id) => {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },
};

export default productApi;

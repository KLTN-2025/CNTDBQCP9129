import axiosClient from "./axiosClient";
const productCategoryApi = {
  getAll: () => axiosClient.get("/product-category"),
  create: (data) => axiosClient.post("/product-category", data),
  update: (id, data) => axiosClient.put(`/product-category/${id}`, data),
  delete: (id) => axiosClient.delete(`/product-category/${id}`),
};
export default productCategoryApi;

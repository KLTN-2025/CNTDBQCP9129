import axiosClient from "./axiosClient";

const blogCategoryApi = {
  getAll: async () => {
    const res = await axiosClient.get("/product-categories");
    return res.data;
  },
  create: async (data) => {
    console.log(data);
    const res = await axiosClient.post("/product-categories", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosClient.put(`/product-categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosClient.delete(`/product-categories/${id}`);
    return res.data;
  },
};

export default blogCategoryApi;

import axiosClient from "./axiosClient";

const blogCategoryApi = {
  getAll: async () => {
    const res = await axiosClient.get("/blog-categories");
    return res.data;
  },
  create: async (data) => {
    const res = await axiosClient.post("/blog-categories", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosClient.put(`/blog-categories/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosClient.delete(`/blog-categories/${id}`);
    return res.data;
  },
};

export default blogCategoryApi;

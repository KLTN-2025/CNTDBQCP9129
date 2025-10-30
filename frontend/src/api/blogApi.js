import axiosClient from "./axiosClient";

const blogApi = {
  // Tạo blog mới
  create: async (data) => {
    const res = await axiosClient.post("/blogs", data);
    return res.data;
  },

  // Lấy tất cả blog
  getAll: async () => {
    const res = await axiosClient.get("/blogs");
    return res.data;
  },

  // Lấy 6 blog ngẫu nhiên
  getRandom: async () => {
    const res = await axiosClient.get("/blogs/random");
    return res.data;
  },

  // Lấy blog theo slug category và slug blog
  getBySlug: async (slugCategory, slug) => {
    const res = await axiosClient.get(`/blogs/${slugCategory}/${slug}`);
    return res.data;
  },

  // Lấy blog theo category slug
  getByCategory: async (slugCategory) => {
    const res = await axiosClient.get(`/blogs/${slugCategory}`);
    return res.data;
  },

  // Cập nhật blog theo ID
  update: async (id, data) => {
    const res = await axiosClient.put(`/blogs/${id}`, data);
    return res.data;
  },

  // Xóa blog theo ID
  delete: async (id) => {
    const res = await axiosClient.delete(`/blogs/${id}`);
    return res.data;
  },
};

export default blogApi;

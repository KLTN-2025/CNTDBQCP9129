import axiosClient from "./axiosClient";

const blogApi = {
  // Tạo blog mới
  create: async (data) => {
    try {
      const res = await axiosClient.post("/blogs", data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data; // trả về message lỗi từ backend
      }
      throw error; // lỗi mạng hoặc Axios khác
    }
  },

  // Lấy tất cả blog
  getAll: async () => {
    try {
      const res = await axiosClient.get("/blogs");
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) return error.response.data;
      throw error;
    }
  },

  // Lấy blog theo slug category và slug blog
  getBySlug: async (slugCategory, slug) => {
    try {
      const res = await axiosClient.get(`/blogs/${slugCategory}/${slug}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) return error.response.data;
      throw error;
    }
  },

  // Lấy blog theo category slug
  getByCategory: async (slugCategory) => {
    try {
      const res = await axiosClient.get(`/blogs/${slugCategory}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) return error.response.data;
      throw error;
    }
  },

  // Cập nhật blog theo ID
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/blogs/${id}`, data);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) return error.response.data;
      throw error;
    }
  },

  // Xóa blog theo ID
  delete: async (id) => {
    try {
      const res = await axiosClient.delete(`/blogs/${id}`);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data) return error.response.data;
      throw error;
    }
  },
};

export default blogApi;

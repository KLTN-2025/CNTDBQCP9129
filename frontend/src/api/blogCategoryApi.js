import axiosClient from "./axiosClient";

// API quản lý Blog Category
const blogCategoryApi = {
  // Lấy tất cả danh mục (công khai)
  getAll: async () => {
    try {
      const res = await axiosClient.get("/blog-categories");
      return res.data; // trả về mảng category từ backend
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Tạo danh mục mới (chỉ admin)
  create: async (data) => {
    try {
      const res = await axiosClient.post("/blog-categories", data);
      return res.data; // trả về category vừa tạo
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Cập nhật danh mục (chỉ admin)
  update: async (id, data) => {
    try {
      const res = await axiosClient.put(`/blog-categories/${id}`, data);
      return res.data; // trả về category đã cập nhật
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Xóa danh mục (chỉ admin)
    delete: async (id) => {
      const res = await axiosClient.delete(`/blog-categories/${id}`);
      return res.data;
    },
};

export default blogCategoryApi;

import axiosClient from "./axiosClient";
export const authApi = {
  loginUser: async (email, password) => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      return res.data; // dữ liệu backend trả về (message, user, token)
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      // Nếu backend trả lỗi (status 400, 401, 500,...) thì lấy message từ backend
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};
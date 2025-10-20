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
  registerUser: async (name, email, password) => {
    try {
      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
      });
      return res; // có đầy đủ res.status, res.data
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      // Throw error để frontend xử lý bằng try-catch
      throw error;
    }
  },
  verifyEmail: async (token) => {
    try {
      const res = await axiosClient.get(`/auth/verify-email?token=${token}`);
      return res;
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const res = await axiosClient.post("/auth/forgot-password", {
        email,
      });
      return res;
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      // Throw error để frontend xử lý bằng try-catch
      throw error;
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      const res = await axiosClient.post(
        `/auth/reset-password?token=${token}`,
        {
          newPassword,
        }
      );
      return res;
    } catch (error) {
      console.error("Lỗi reset password:", error);
      throw error;
    }
  },
  changePassword: async (oldPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.put(
        "/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};

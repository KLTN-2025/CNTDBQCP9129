import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // URL gốc của backend
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🧩 Interceptor RESPONSE
// Xử lý phản hồi hoặc lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    return response; // trả về dữ liệu nếu thành công
  },
  (error) => {
    // nếu backend trả lỗi 401 (token hết hạn)
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      // có thể redirect tới /login nếu muốn
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

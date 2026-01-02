import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://coffee-go.onrender.com/api", 
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
// Xử lý phản hồi hoặc lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

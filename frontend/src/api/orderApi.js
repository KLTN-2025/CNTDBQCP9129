import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: async(data) => {
    const res = await axiosClient.post('/orders', data);
    return res.data
  },

  getAllOrders: async(params) => {
    const res = await axiosClient.get('/orders', { params }); // Thêm params
    return res.data
  }
}
export default orderApi
import axiosClient from "./axiosClient";

const orderApi = {
  createOrder: async(data) => {
    const res = await axiosClient.post('/orders', data);
    return res.data
  },

  getAllOrders: async() => {
    const res = await axiosClient.get('/orders');
    return res.data
  }
}
export default orderApi
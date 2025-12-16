import axiosClient from "./axiosClient";

const orderApi = {
  createOrderOffline: async(data) => {
    const res = await axiosClient.post('/orders', data);
    return res.data
  },
  getAllOrders: async(params) => {
    const res = await axiosClient.get('/orders', { params }); 
    return res.data
  },
  getAllOrdersByUserId: async(userId) => {
    const res = await axiosClient.get(`/orders/user/${userId}`); 
    return res.data
  },
  getOrderById: async(orderId) => {
    const res = await axiosClient.get(`/orders/${orderId}`);
    return res.data;
  },
  completeOrder: async (id) => {
    const res = await axiosClient.patch(`/orders/${id}/complete`);
    return res.data;
  }
}
export default orderApi
import axiosClient from "./axiosClient";

const orderApi = {
  createOrderOffline: async(data) => {
    const res = await axiosClient.post('/orders', data);
    return res.data
  },
  getAllOrders: async ({ startDate, endDate }) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/orders?${params.toString()}`);
    return res.data; 
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
// api/dashboardApi.js
import axiosClient from "./axiosClient";

const dashboardApi = {
  getOverview: async () => {
    const res = await axiosClient.get('/dashboard/overview');
    return res.data;
  },

  getRevenue: async (period = 'day', startDate, endDate) => {
    const params = new URLSearchParams();
    params.append('period', period);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/revenue?${params.toString()}`);
    return res.data;
  },

  getTopProducts: async (limit = 5) => {
    const res = await axiosClient.get(`/dashboard/top-products?limit=${limit}`);
    return res.data;
  },

  getOrderType: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/order-type?${params.toString()}`);
    return res.data;
  },

  getOrderStatus: async () => {
    const res = await axiosClient.get('/dashboard/order-status');
    return res.data;
  }
}

export default dashboardApi;
import axiosClient from "./axiosClient";

const dashboardApi = {
  getOverview: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/overview?${params.toString()}`);
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

  getTopProducts: async (limit = 5, startDate, endDate) => {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/top-products?${params.toString()}`);
    return res.data;
  },

  getOrderType: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/order-type?${params.toString()}`);
    return res.data;
  },

  getOrderStatus: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/dashboard/order-status?${params.toString()}`);
    return res.data;
  }
}

export default dashboardApi;
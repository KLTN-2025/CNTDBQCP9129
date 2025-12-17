import axiosClient from "./axiosClient";

const reservationApi = {
  getAll: async ({ startDate, endDate } = {}) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/reservations?${params.toString()}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/reservations", data);
    return res.data;
  },

  confirm: async (id) => {
    const res = await axiosClient.patch(`/reservations/${id}/confirm`);
    return res.data.reservation; 
  },

  cancel: async (id) => {
    const res = await axiosClient.patch(`/reservations/${id}/cancel`);
    return res.data.reservation; 
  },

  delete: async (id) => {
    const res = await axiosClient.delete(`/reservations/${id}`);
    return res.data;
  },
};

export default reservationApi;
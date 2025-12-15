import axiosClient from "./axiosClient";

const reservationApi = {
  getAll: async () => {
    const res = await axiosClient.get("/reservations");
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post("/reservations", data);
    return res.data;
  },

  confirm: async (id) => {
    const res = await axiosClient.patch(`/reservations/${id}/confirm`);
    return res.data;
  },

  cancel: async (id) => {
    const res = await axiosClient.patch(`/reservations/${id}/cancel`);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosClient.delete(`/reservations/${id}`);
    return res.data;
  },
};

export default reservationApi;

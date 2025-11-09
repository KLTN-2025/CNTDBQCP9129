import axiosClient from "./axiosClient";

const cartApi = {
  getCart: async (id) => {
    const res = await axiosClient.get(`/carts/${id}`);
    return res.data;
  },
  addToCart: async (id, data) => {
    console.log(data);
    const res = await axiosClient.post(`/carts/${id}`, data);
    return res.data;
  },
  updateCartItem: async (id, data) => {
    const res = await axiosClient.patch(`/carts/${id}`, data);
    return res.data;
  },
  removeCartItem: async (id, data) => {
    const res = await axiosClient.put(`/${id}/item`, data);
    return res.data;
  },
};

export default cartApi;

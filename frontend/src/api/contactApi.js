import axiosClient from "./axiosClient";
const contactApi = {
  getAllByRouter: async(router) => {
    const res = await axiosClient.get(`/${router}`);
    return res.data;
  },
  createContact: async(data) => {
    const res = await axiosClient.post('/contacts', data);
    return res.data
  },
  deleteContact: async(id) => {
    const res = await axiosClient.delete(`/contacts/${id}`);
    return res.data
  },
  markAsRead: async(id) => {
    const res = await axiosClient.put(`/contacts/read/${id}`);
    return res.data;
  }
}
export default contactApi;
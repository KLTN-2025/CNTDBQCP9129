import axiosClient from "./axiosClient";
const contactApi = {
  getAll: async() => {
    const res = await axiosClient.get('/contacts');
    return res.data;
  },
  createContact: async(data) => {
    const res = await axiosClient.create('/contacts', data);
    return res.data
  }
}
export default contactApi;
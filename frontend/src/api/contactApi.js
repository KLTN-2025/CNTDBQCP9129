import axiosClient from "./axiosClient";
const contactApi = {
  getAll: async() => {
    const res = await axiosClient.get('/contacts');
    return res.data;
  }
}
export default contactApi;
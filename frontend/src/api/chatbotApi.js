import axiosClient from "./axiosClient";

const productApi = {
  sendMess: async(message) => {
    const res = await axiosClient.post('/chat', message);
    return res.data;
  }
}
export default productApi;
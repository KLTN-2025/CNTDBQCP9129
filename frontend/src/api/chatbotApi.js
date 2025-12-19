import axiosClient from "./axiosClient";

const chatbotApi = {
  sendMess: async(message) => {
    const res = await axiosClient.post('/chat', message);
    return res.data;
  }
}
export default chatbotApi;
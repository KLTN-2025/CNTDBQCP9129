import axiosClient from "./axiosClient";

const paymentApi = {
  createPayment: async(data) => {
    const res = await axiosClient.post('/payment/create', data);
    return res.data;
  }
}
export default paymentApi
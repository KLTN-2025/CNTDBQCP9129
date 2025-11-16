import axiosClient from "./axiosClient";

const voucherApi = {
  getAllVouchers: async() => {
    const res = await axiosClient.get('/vouchers');
    return res.data;
  },
  createVoucher: async() => {
    const res = await axiosClient.post('/vouchers');
    return res.data;
  },
}
export default voucherApi;
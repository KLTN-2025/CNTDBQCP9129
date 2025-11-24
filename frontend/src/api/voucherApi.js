import axiosClient from "./axiosClient";

const voucherApi = {
  getAllVouchers: async() => {
    const res = await axiosClient.get('/vouchers');
    return res.data;
  },
  createVoucher: async(data) => {
    const res = await axiosClient.post('/vouchers', data);
    return res.data;
  },
  applyVoucher: async(data) => {
    const res = await axiosClient.post('/vouchers/check-voucher', data);
    return res.data;
  },
  getAvailableVouchers: async() => {
    const res = await axiosClient.get('/vouchers/availableVouchers');
    return res.data;
  },
  deactivateVoucher: async(id) => {
    const res = await axiosClient.patch(`/vouchers/deactivateVoucher/${id}`);
    return res.data
  }
}
export default voucherApi;

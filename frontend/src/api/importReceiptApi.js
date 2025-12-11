import axiosClient from "./axiosClient";

const importReceiptApi = {
  getAll: async () => {
    const res = await axiosClient.get('/import-receipts');
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/import-receipts/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post('/import-receipts', data);
    return res.data;
  },
}

export default importReceiptApi;

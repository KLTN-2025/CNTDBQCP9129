import axiosClient from "./axiosClient";

const importReceiptApi = {
  getAll: async ({ startDate, endDate } = {}) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const res = await axiosClient.get(`/import-receipts?${params.toString()}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/import-receipts/${id}`);
    return res.data;
  },

  createImport: async (data) => {
    const res = await axiosClient.post('/import-receipts/import', data);
    return res.data;
  },
  
  createExport: async (data) => {
    const res = await axiosClient.post('/import-receipts/export', data);
    return res.data;
  },
}

export default importReceiptApi;
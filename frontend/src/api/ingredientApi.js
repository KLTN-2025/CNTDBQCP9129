import axiosClient from "./axiosClient";

const ingredientApi = {
  getAll: async () => {
    const res = await axiosClient.get("/ingredients");
    return res.data;
  },
  create: async (data) => {
    console.log(data);
    const res = await axiosClient.post("/ingredients", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosClient.put(`/ingredients/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosClient.delete(`/ingredients/${id}`);
    return res.data;
  },
};

export default ingredientApi;

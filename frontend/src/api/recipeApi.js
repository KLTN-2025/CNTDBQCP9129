import axiosClient from "./axiosClient";

const recipeApi = {
  getAll: async () => {
    const res = await axiosClient.get("/recipes");
    return res.data;
  },
  create: async (data) => {
    console.log(data);
    const res = await axiosClient.post("/recipes", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosClient.put(`/recipes/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosClient.delete(`/recipes/${id}`);
    return res.data;
  },
};

export default recipeApi;

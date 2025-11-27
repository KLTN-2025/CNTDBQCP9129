import axiosClient from "./axiosClient";

const userApi = {
  getAllUsers: async(router) => {
    const res = await axiosClient.get(`/${router}`);
    return res.data
  },
  
  updateUserRole: async(id, data) => {
    const res = await axiosClient.patch(`/users/${id}`, data);
    return res.data
  }
}
export default userApi
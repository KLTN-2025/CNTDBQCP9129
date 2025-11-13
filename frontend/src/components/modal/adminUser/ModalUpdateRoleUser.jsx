import Modal from "react-modal";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
const ModalUpdateRoleUser = ({
  isOpenModalUpdateRoleUser,
  setIsOpenModalUpdateRoleUser,
  selectedRole,
  setSelectedRole,
  onConfirm,
}) => {
  useLockBodyScroll(isOpenModalUpdateRoleUser);
    const handleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateRoleUser}
      onRequestClose={() => setIsOpenModalUpdateRoleUser(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "8rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          background: "white",
          borderRadius: "0.5rem",
          overflow: "visible",
          width: "100%",
          maxWidth: "460px",
        },
      }}
    >
      <div className="overflow-hidden rounded-md w-full flex flex-col select-none">
        <div className="w-full py-3 px-4 relative border-b-1 border-b-gray-400">
          <p className="font-bold text-xl">Phân quyền người dùng</p>
        </div>
        <div className="py-8 px-4 flex gap-x-4">
          <p>Vai trò: </p>
          <select
            value={selectedRole}
            onChange={handleChange}
            className="border px-2 cursor-pointer rounded-md"
          >
            <option value="customer">Khách hàng</option>
            <option value="manager">Nhân viên</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex items-center gap-x-6 px-4 w-full py-8">
          <button
            className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalUpdateRoleUser(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-600 w-full rounded-md px-2 py-2 cursor-pointer"
            onClick={onConfirm}
          >
            Cập nhật
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateRoleUser;

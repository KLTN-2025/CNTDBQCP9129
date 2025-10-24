import Modal from "react-modal";
import { motion } from "framer-motion";
import { useState } from "react";
import blogCategoryApi from "../../api/blogCategoryApi";
import { toast } from "react-toastify";
const ModalCreateBlogCategory = ({isOpenModalCreateCategory, setIsOpenModalCreateCategory, setCategories}) => {
  const [newNameCategory, setNewNameCategory] = useState('');
 const handleCreateCategory = async () => {
    if (!newNameCategory.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    try {
      const newCategory = await blogCategoryApi.create({ name: newNameCategory });
      if (newCategory && newCategory._id && newCategory.name) {
        setCategories(prev => [newCategory, ...prev]);
        toast.success('Thêm mới danh mục thành công!')
      } else {
        toast.error(newCategory.message);
      }
      setNewNameCategory('');
      setIsOpenModalCreateCategory(false);
    } catch (err) {
      toast(err.message || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };
  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateCategory}
      onRequestClose={() => setIsOpenModalCreateCategory(false)}
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
      <motion.div className="bg-color-dash overflow-hidden rounded-md w-full flex flex-col select-none">
        <div className="w-full bg-color-dash py-3 px-4 relative border-b-1 border-b-gray-400">
          <p className="font-bold text-xl">Thêm danh mục mới</p>
        </div>
        <div className="py-8 px-4 space-y-4">
          <p>Tên danh mục *</p>
          <input
            type="text"
            value={newNameCategory}
            onChange={(e) => setNewNameCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Tên danh mục"
          />
        </div>
        <div className="flex items-center gap-x-6 px-4 w-full py-8">
           <button className="w-full border px-2 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateCategory(false)}
           >Hủy</button>
           <button className="bg-green-700 w-full rounded-md px-2 py-2 cursor-pointer"
            onClick={handleCreateCategory}
           >Thêm mới</button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ModalCreateBlogCategory;

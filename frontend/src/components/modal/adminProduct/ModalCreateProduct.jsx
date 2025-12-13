import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useUpAndGetLinkImage from "../../../hooks/useUpAndGetLinkImage";
import productCategoryApi from "../../../api/productCategoryApi";
import productApi from "../../../api/productApi";

const ModalCreateProduct = ({
  isOpenModalCreateProduct,
  setIsOpenModalCreateProduct,
  setProducts
}) => {
  useLockBodyScroll(isOpenModalCreateProduct);

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    productCategoryId: "",
    description: "",
    price: "",
    discount: 0,
  });
  const [nameProductCategory, setNameProductCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFile, handleImageChange, setSelectedFile } = usePreviewImage(1);
  const { handleImageUpload } = useUpAndGetLinkImage();

  const inputRef = useRef(null);

  // Lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productCategoryApi.getAll();
        setCategories(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi lấy danh mục");
      }
    };
    fetchCategories();
  }, []);

  // Hàm xử lý nhập liệu chung, convert number khi cần
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount"
          ? value === "" 
            ? ""
            : Number(value) 
          : value,
    }));
  };

  // Xóa ảnh
  const handleRemoveImage = () => setSelectedFile([]);

  // Submit form
  const handleSubmit = async () => {
    if (isLoading) return;

    if (
      !formData.name.trim() ||
      !formData.productCategoryId ||
      formData.price == "" ||
      formData.discount === "" ||
      selectedFile.length === 0
    ) {
      toast.error("Vui lòng nhập đầy đủ hoặc đúng thông tin sản phẩm");
      return;
    }

    try {
      setIsLoading(true);

      const imageURLs = await handleImageUpload(selectedFile);

      const newProduct = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        image: imageURLs[0],
      };

      const response = await productApi.create(newProduct);

      if (!response.message) {
        toast.success("Thêm sản phẩm thành công!");
        setProducts((prev) => [
                    {
            ...response,
            productCategoryId: {
              ...response.productCategoryId,
              name: nameProductCategory
            }
          },
          ...prev
        ]);
        setIsOpenModalCreateProduct(false);
      } else {
        toast.error(response.message || "Đã có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateProduct}
      onRequestClose={() => setIsOpenModalCreateProduct(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "1rem",
          left: "auto",
          right: "auto",
          bottom: "1rem",
          padding: 0,
          overflow: "auto",
          border: "none",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "500px",
        },
      }}
    >
      <div className="bg-white overflow-y-auto rounded-md w-full flex flex-col select-none">
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Thêm sản phẩm mới</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Danh mục */}
          <div>
            <label className="font-medium">Danh mục *</label>
            <select
              name="productCategoryId"
              value={formData.productCategoryId}
              onChange={(e) => {
                const value = e.target.value;
                const name = e.target.options[e.target.selectedIndex].text;
                setNameProductCategory(name)
                setFormData((prev) => ({
                  ...prev,
                  productCategoryId: value,
                }));
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tên sản phẩm */}
          <div>
            <label className="font-medium">Tên sản phẩm *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="font-medium">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sản phẩm"
              className="w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          {/* Giá tiền */}
          <div>
            <label className="font-medium">Giá tiền *</label>
            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Nhập giá sản phẩm"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Giảm giá */}
          <div>
            <label className="font-medium">Giảm giá (%)</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="font-medium">Ảnh sản phẩm *</label>
            <input
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <FaImage
              className="text-3xl cursor-pointer mt-2"
              onClick={() => inputRef.current.click()}
            />
            {selectedFile.length > 0 && (
              <div className="relative inline-block mt-2">
                <img
                  src={selectedFile[0]}
                  alt="Ảnh sản phẩm"
                  className="w-16 h-16 object-cover rounded"
                />
                <IoIosRemoveCircle
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full hover:bg-red-500 transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-4 px-6 py-4 border-t">
          <button
            className="w-full border px-4 py-2 rounded-md cursor-pointer"
            onClick={() => setIsOpenModalCreateProduct(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-700 w-full text-white flex items-center justify-center rounded-md px-4 py-2 cursor-pointer"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <img
                className="object-cover w-7 h-7 rounded-full"
                src="/loading.gif"
                alt="đang tải"
              />
            ) : (
              <p>Thêm mới</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateProduct;

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

const ModalUpdateProduct = ({
  isOpenModalUpdateProduct,
  setIsOpenModalUpdateProduct,
  product,
  setProducts,
}) => {
  useLockBodyScroll(isOpenModalUpdateProduct);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "",
    name: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFile, handleImageChange, setSelectedFile } =
    usePreviewImage(1);
  const { handleImageUpload } = useUpAndGetLinkImage();
  const inputRef = useRef(null);

  // Lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productCategoryApi.getAll();
        setCategories(data);
      } catch {
        toast.error("Lỗi khi lấy danh mục");
      }
    };
    fetchCategories();
  }, []);

  // Khi mở modal, đổ dữ liệu cũ
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setDiscount(product.discount || 0);
      setSelectedCategory(product.productCategoryId || { _id: "", name: "" });
      setSelectedFile(product.image ? [product.image] : []);
    }
  }, [product, isOpenModalUpdateProduct]);

  const handleRemoveImage = () => setSelectedFile([]);

  const handleSubmit = async () => {
    if (isLoading) return;

    if (
      !name.trim() ||
      !selectedCategory._id ||
      !price ||
      selectedFile.length === 0
    ) {
      return toast.error("Vui lòng nhập đầy đủ thông tin");
    }
    if (discount > 100) {
      return toast.error("Vui lòng nhập giảm giá không lớn hơn 100");
    }

    try {
      setIsLoading(true);

      let imageURL = selectedFile;

      if (selectedFile.length > 0 && selectedFile[0].startsWith("data:")) {
        imageURL = await handleImageUpload(selectedFile);
      }

      const updatedData = {
        name,
        productCategoryId: selectedCategory._id,
        description,
        price,
        discount,
        image: Array.isArray(imageURL) ? imageURL[0] : imageURL,
      };

      const updatedProduct = await productApi.update(product._id, updatedData);

      if (updatedProduct && !updatedProduct.message) {
        toast.success("Cập nhật sản phẩm thành công");

        // Cập nhật lại danh sách products bên frontend
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id
              ? { ...updatedProduct, productCategoryId: selectedCategory }
              : p
          )
        );

        setIsOpenModalUpdateProduct(false);
        setSelectedFile([]);
      } else {
        toast.error(updatedProduct.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateProduct}
      onRequestClose={() => setIsOpenModalUpdateProduct(false)}
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
          <p className="font-bold text-lg">Cập nhật sản phẩm</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Danh mục */}
          <div>
            <label className="font-medium">Danh mục *</label>
            <select
              value={selectedCategory._id}
              onChange={(e) => {
                const cat = categories.find((c) => c._id === e.target.value);
                setSelectedCategory(cat || { _id: "", name: "" });
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sản phẩm"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="font-medium">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Nhập giá sản phẩm"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Giảm giá */}
          <div>
            <label className="font-medium">Giảm giá (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              max="100"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="font-medium">Ảnh sản phẩm</label>
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
            onClick={() => setIsOpenModalUpdateProduct(false)}
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
              <p>Cập nhật</p>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateProduct;

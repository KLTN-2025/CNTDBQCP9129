import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import blogCategoryApi from "../../../api/blogCategoryApi";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useUpAndGetLinkImage from "../../../hooks/useUpAndGetLinkImage";
import blogApi from "../../../api/blogAPI";

const ModalCreateBlog = ({
  isOpenModalCreateBlog,
  setIsOpenModalCreateBlog,
  setAllBlogs
}) => {
  useLockBodyScroll(isOpenModalCreateBlog);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({_id: "", name: ""});
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFile, handleImageChange, setSelectedFile } =
    usePreviewImage();
  const {handleImageUpload} = useUpAndGetLinkImage()
  const [introHighlight, setIntroHighlight] = useState("");
  const [bodyHighlight, setBodyHighlight] = useState("");
  const [conclusionHighlight, setConclusionHighlight] = useState("");

  // Thay editor bằng state cho textarea
  const [introText, setIntroText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [conclusionText, setConclusionText] = useState("");

  const handleRemoveImage = (indexImage) => {
    const newSelectedFile = selectedFile.filter((_, i) => i !== indexImage);
    setSelectedFile(newSelectedFile);
  };
  
  // Lấy tất cả danh mục của blog
  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const data = await blogCategoryApi.getAll();
        setCategories(data);
      } catch {
        toast.error("Lỗi lấy danh mục");
      }
    };
    fetchBlogCategories();
  }, []);
  
  // Hàm thêm blog
  const handleSubmit = async() => {
    if(isLoading) return
    if (
      !title.trim() ||
      !selectedCategory._id ||
      selectedFile.length === 0 ||
      !introHighlight.trim() ||
      !introText.trim() ||
      !bodyHighlight.trim() ||
      !bodyText.trim() ||
      !conclusionHighlight.trim() ||
      !conclusionText.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ các thông tin bài viết");
      return;
    }
    try {
      setIsLoading(true);
      const imageURLs = await handleImageUpload(selectedFile);
      const dataBlog = {
        title,
        categoryId: selectedCategory._id,
        images: imageURLs,
        content: {
          intro: {
            highlight: introHighlight,
            text: introText,
          },
          body: {
            highlight: bodyHighlight,
            text: bodyText,
          },
          conclusion: {
            highlight: conclusionHighlight,
            text: conclusionText,
          },
        },
      };
      const newBlog = await blogApi.create(dataBlog);
      if(!newBlog.message){
        toast.success("Thêm bài viết thành công");
        setAllBlogs((blogs) => [...blogs, {...newBlog, categoryId: selectedCategory}]);
        setIsOpenModalCreateBlog(false);
      }else {
        toast.error(newBlog.message || "Đã có lỗi xảy ra vui lòng thử lại");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi thêm mới")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateBlog}
      onRequestClose={() => setIsOpenModalCreateBlog(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "4rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "90vw",
          maxHeight: "calc(100vh - 10rem)",
          overflow: "auto",
        },
      }}
    >
      <div className="bg-color-dash overflow-hidden rounded-md w-full flex flex-col select-none p-4">
        <h2 className="text-xl font-bold mb-4">Thêm bài viết mới</h2>

        {/* Tiêu đề */}
        <div className="mb-4">
          <label className="font-medium">Tiêu đề*</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
          />
        </div>

        {/* Danh mục */}
        <div className="mb-4">
          <label className="font-medium">Danh mục*</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedCategory.id}
            onChange={(e) => { 
              const cate = categories.find((cat) => cat._id === e.target.value);
              setSelectedCategory(cate || {_id: "", name: ""});
            }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload ảnh */}
        <div className="mb-4">
          <label className="font-medium">Ảnh bài viết</label>
          <p className="text-xs">Tối đa 3 ảnh, 1 ảnh chính và 2 ảnh phụ</p>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 border-1 px-2 cursor-pointer rounded-xs"
          />
          <div
            className={`flex gap-2 mt-2 bg-gray-300 px-2 max-w-xs py-2 ${
              selectedFile.length > 0 ? "flex" : "hidden"
            }`}
          >
            {selectedFile.map((image, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={image}
                  alt="ảnh bài viết"
                  className="w-16 h-16 object-cover rounded"
                />
                <IoIosRemoveCircle
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-500 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Intro */}
        <div className="mb-4">
          <label className="font-medium">Intro - highlight</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mb-1"
            value={introHighlight}
            onChange={(e) => setIntroHighlight(e.target.value)}
            placeholder="Nhập điểm nhất cho nội dung"
          />
          <textarea
            className="w-full border px-3 py-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
            value={introText}
            onChange={(e) => setIntroText(e.target.value)}
            placeholder="Nhập nội dung intro..."
          />
        </div>

        {/* Body */}
        <div className="mb-4">
          <label className="font-medium">Body - highlight</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mb-1"
            value={bodyHighlight}
            onChange={(e) => setBodyHighlight(e.target.value)}
            placeholder="Nhập điểm nhất cho nội dung"
          />
          <textarea
            className="w-full border px-3 py-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="Nhập nội dung body..."
          />
        </div>

        {/* Conclusion */}
        <div className="mb-4">
          <label className="font-medium">Conclusion - highlight</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded mb-1"
            value={conclusionHighlight}
            onChange={(e) => setConclusionHighlight(e.target.value)}
            placeholder="Nhập điểm nhấn cho nội dung"
          />
          <textarea
            className="w-full border px-3 py-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
            value={conclusionText}
            onChange={(e) => setConclusionText(e.target.value)}
            placeholder="Nhập nội dung conclusion..."
          />
        </div>

        {/* Button */}
        <div className="flex gap-4 mt-4 w-full justify-end ">
          <button
            className=" border px-4 py-2 rounded-md  cursor-pointer"
            onClick={() => setIsOpenModalCreateBlog(false)}
          >
            Hủy
          </button>
          <button
            className=" bg-green-700  text-white px-4 py-2 rounded-md  flex justify-center items-center cursor-pointer"
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

export default ModalCreateBlog;
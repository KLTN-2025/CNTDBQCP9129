import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { IoIosRemoveCircle } from "react-icons/io";
import blogCategoryApi from "../../../api/blogCategoryApi";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useUpAndGetLinkImage from "../../../hooks/useUpAndGetLinkImage";
import blogApi from "../../../api/blogAPI";

const ModalUpdateBlog = ({
  isOpenModalUpdateBlog,
  setIsOpenModalUpdateBlog,
  blogData,
  setAllBlogs,
}) => {
  useLockBodyScroll(isOpenModalUpdateBlog);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    _id: "",
    name: "",
  });
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFile, handleImageChange, setSelectedFile } = usePreviewImage(3);
  const { handleImageUpload } = useUpAndGetLinkImage();

  const [introHighlight, setIntroHighlight] = useState("");
  const [bodyHighlight, setBodyHighlight] = useState("");
  const [conclusionHighlight, setConclusionHighlight] = useState("");

  const [introText, setIntroText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [conclusionText, setConclusionText] = useState("");

  // Load danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogCategoryApi.getAll();
        setCategories(data);
      } catch {
        toast.error("Lỗi lấy danh mục");
      }
    };
    fetchCategories();
  }, []);

  // Khi mở modal -> đổ dữ liệu cũ
  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title || "");
      setSelectedCategory(blogData.categoryId || { _id: "", name: "" });

      // Đảm bảo images luôn là mảng
      const imagesArray = Array.isArray(blogData.images)
        ? blogData.images
        : blogData.images
        ? [blogData.images]
        : [];
      setSelectedFile(imagesArray);

      setIntroHighlight(blogData.content?.intro?.highlight || "");
      setIntroText(blogData.content?.intro?.text || "");
      setBodyHighlight(blogData.content?.body?.highlight || "");
      setBodyText(blogData.content?.body?.text || "");
      setConclusionHighlight(blogData.content?.conclusion?.highlight || "");
      setConclusionText(blogData.content?.conclusion?.text || "");
    }
  }, [blogData]);

  // Xóa ảnh khỏi preview
  const handleRemoveImage = (indexImage) => {
    const newSelectedFile = selectedFile.filter((_, i) => i !== indexImage);
    setSelectedFile(newSelectedFile);
  };

  //  Cập nhật blog
  const handleUpdate = async () => {
    if (isLoading) return;

    // Kiểm tra ràng buộc dữ liệu
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
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setIsLoading(true);

      let imageURLs = selectedFile;
      // Nếu có ảnh base64 thì upload
      if (selectedFile.some((img) => img.startsWith("data:"))) {
        imageURLs = await handleImageUpload(selectedFile);
      }

      const dataBlog = {
        title,
        categoryId: selectedCategory._id,
        images: imageURLs,
        content: {
          intro: { highlight: introHighlight, text: introText },
          body: { highlight: bodyHighlight, text: bodyText },
          conclusion: { highlight: conclusionHighlight, text: conclusionText },
        },
      };

      const updatedBlog = await blogApi.update(blogData._id, dataBlog);

      if (updatedBlog && !updatedBlog.message) {
        toast.success("Cập nhật bài viết thành công");

        //  Cập nhật lại danh sách blogs trong frontend
        setAllBlogs((prev) =>
          prev.map((b) =>
            b._id === blogData._id
              ? { ...updatedBlog, categoryId: selectedCategory }
              : b
          )
        );

        //  Đóng modal và reset state
        setIsOpenModalUpdateBlog(false);
        setSelectedFile([]);
      } else {
        toast.error(updatedBlog.message || "Đã có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi cập nhật bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalUpdateBlog}
      onRequestClose={() => setIsOpenModalUpdateBlog(false)}
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
        <h2 className="text-xl font-bold mb-4">Cập nhật bài viết</h2>

        {/* Tiêu đề */}
        <div className="mb-4">
          <label className="font-medium">Tiêu đề*</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
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
            value={selectedCategory._id}
            onChange={(e) => {
              const cat = categories.find((c) => c._id === e.target.value);
              setSelectedCategory(cat || { _id: "", name: "" });
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
        <div className="mb-4 space-x-4">
          <label className="font-medium">Ảnh bài viết</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 border-1 px-2 cursor-pointer"
          />
          <div className="flex flex-wrap gap-2 mt-2 bg-gray-200 p-2 rounded-md">
            {selectedFile.map((image, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={image}
                  alt="ảnh bài viết"
                  className="w-16 h-16 object-cover rounded"
                />
                <IoIosRemoveCircle
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full hover:bg-red-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung intro/body/conclusion */}
        {[
          {
            label: "Intro",
            highlight: introHighlight,
            text: introText,
            setH: setIntroHighlight,
            setT: setIntroText,
          },
          {
            label: "Body",
            highlight: bodyHighlight,
            text: bodyText,
            setH: setBodyHighlight,
            setT: setBodyText,
          },
          {
            label: "Conclusion",
            highlight: conclusionHighlight,
            text: conclusionText,
            setH: setConclusionHighlight,
            setT: setConclusionText,
          },
        ].map((section, i) => (
          <div key={i} className="mb-4">
            <label className="font-medium">{section.label} - highlight</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-1"
              value={section.highlight}
              onChange={(e) => section.setH(e.target.value)}
              placeholder="Nhập điểm nhấn"
            />
            <textarea
              className="w-full border px-3 py-2 rounded min-h-[120px]"
              value={section.text}
              onChange={(e) => section.setT(e.target.value)}
              placeholder={`Nhập nội dung ${section.label.toLowerCase()}...`}
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4 mt-4 justify-end">
          <button
            className="border px-4 py-2 rounded-md"
            onClick={() => setIsOpenModalUpdateBlog(false)}
          >
            Hủy
          </button>
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={handleUpdate}
          >
            {isLoading ? (
              <img
                className="object-cover w-6 h-6 rounded-full"
                src="/loading.gif"
                alt="loading"
              />
            ) : (
              "Cập nhật"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUpdateBlog;

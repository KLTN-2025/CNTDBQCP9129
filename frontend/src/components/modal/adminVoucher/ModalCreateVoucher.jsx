import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import voucherApi from "../../../api/voucherApi";
import { FaImage } from "react-icons/fa6";
import productCategoryApi from "../../../api/productCategoryApi";
import getLocalDateTimeMin from "../../../utils/getLocalDateTimeMin";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import { IoIosRemoveCircle } from "react-icons/io";
import { useRef } from "react";
import usePreviewImage from "../../../hooks/usePreviewImage";
import useUpAndGetLinkImage from "../../../hooks/useUpAndGetLinkImage";
const ModalCreateVoucher = ({
  isOpenModalCreateVoucher,
  setIsOpenModalCreateVoucher,
  setVouchers,
}) => {
  useLockBodyScroll(isOpenModalCreateVoucher);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);
  const { selectedFile, handleImageChange, setSelectedFile } =
    usePreviewImage(1);
  const { handleImageUpload } = useUpAndGetLinkImage();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      description: "",
      discountType: "amount",
      discountValue: "",
      startDate: "",
      endDate: "",
      image: "",
      usageLimit: "",
      perUserLimit: "",
      minOrderValue: "",
      maxDiscountAmount: null,
      applicableCategories: [],
    },
  });
  const discountType = watch("discountType");
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productCategoryApi.getAll();
        setCategories(res);
      } catch {
        toast.error("Không tải được danh mục");
      }
    };
    if (isOpenModalCreateVoucher) fetchCategories();
  }, [isOpenModalCreateVoucher]);

  const onSubmit = async (data) => {
    try {
      data.discountValue = Number(data.discountValue);
      data.usageLimit = Number(data.usageLimit);
      data.perUserLimit = Number(data.perUserLimit);
      data.minOrderValue = Number(data.minOrderValue);
      data.maxDiscountAmount =
        data.maxDiscountAmount != null && data.maxDiscountAmount !== ""
          ? Number(data.maxDiscountAmount)
          : null;
      const imageURLs = await handleImageUpload(selectedFile);
      data.image = imageURLs[0];
      const response = await voucherApi.createVoucher(data);
      if (!response.message) {
        const now = new Date();
        const newVoucher = { ...response };
        newVoucher.status = now < newVoucher.startDate ? "upcoming" : "active";
        toast.success("Thêm voucher thành công!");
        setVouchers((prev) => [newVoucher, ...prev]);
        setIsOpenModalCreateVoucher(false);
        reset();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi khi thêm voucher");
    }
  };

  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpenModalCreateVoucher}
      onRequestClose={() => setIsOpenModalCreateVoucher(false)}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        },
        content: {
          top: "2rem",
          left: "auto",
          right: "auto",
          bottom: "auto",
          padding: 0,
          border: "none",
          borderRadius: "0.5rem",
          width: "100%",
          maxWidth: "700px",
        },
      }}
    >
      <div className="bg-white rounded-md w-full flex flex-col select-none">
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Thêm voucher mới</p>
        </div>

        <form
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="font-medium">Mã voucher *</label>
            <input
              {...register("code", {
                required: "Mã voucher bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mã voucher phải tối thiểu 6 ký tự",
                },
                maxLength: {
                  value: 20,
                  message: "Mã voucher tối đa 20 ký tự",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: "Mã voucher không được chứa dấu hoặc ký tự đặc biệt",
                },
              })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nhập mã voucher"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Mô tả *</label>
            <input
              {...register("description", { required: "Mô tả bắt buộc" })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nhập mô tả voucher"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium">Loại giảm giá *</label>
              <select
                {...register("discountType", { required: true })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="amount">Tiền</option>
                <option value="percent">Phần trăm</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Giá trị giảm *</label>
              <input
                type="number"
                placeholder="Nhập số tiền muốn giảm"
                {...register("discountValue", {
                  required: "Bắt buộc",
                  min: { value: 1, message: "Phải > 0" },
                  validate: (value) => {
                    if (discountType === "percent" && value > 100) {
                      return "Giảm phần trăm không được lớn hơn 100";
                    }
                    return true;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.discountValue && (
                <p className="text-red-500 text-sm">
                  {errors.discountValue.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium">Thời gian bắt đầu *</label>
              <input
                type="datetime-local"
                min={getLocalDateTimeMin()}
                {...register("startDate", {
                  required: "Thời gian bắt đầu bắt buộc",
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Thời gian kết thúc *</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("endDate", {
                  required: "Thời gian kết thúc bắt buộc",
                  validate: (value) => {
                    const startDate = new Date(getValues("startDate"));
                    const endDate = new Date(value);
                    if (endDate <= startDate)
                      return "Thời gian kết thúc phải lớn hơn thời gian bắt đầu";
                    return true;
                  },
                })}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm">{errors.endDate.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="font-medium mb-1 block">Danh mục áp dụng</label>
            <Controller
              name="applicableCategories"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.name,
                  }))}
                  isMulti
                  placeholder="Chọn danh mục..."
                  className="basic-multi-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  classNamePrefix="select"
                  onChange={(selected) =>
                    field.onChange(selected.map((s) => s.value))
                  }
                  value={categories
                    .filter((c) => field.value.includes(c._id))
                    .map((c) => ({ value: c._id, label: c.name }))}
                />
              )}
            />
          </div>
          <div>
            <label className="font-medium">Ảnh sản phẩm *</label>

            <Controller
              name="image"
              control={control}
              rules={{ required: "Ảnh sản phẩm bắt buộc" }}
              render={({ field }) => {
                const handleFileChange = (e) => {
                  handleImageChange(e); // cập nhật selectedFile trong hook
                  if (e.target.files.length > 0) {
                    field.onChange(e.target.files[0]); // cập nhật giá trị useForm
                  } else {
                    field.onChange(""); // xóa nếu bỏ chọn
                  }
                };

                return (
                  <>
                    <input
                      type="file"
                      ref={inputRef}
                      onChange={handleFileChange}
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
                          onClick={() => {
                            setSelectedFile([]);
                            field.onChange(""); // xóa giá trị trong useForm
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 cursor-pointer bg-black text-white rounded-full hover:bg-red-500 transition"
                        />
                      </div>
                    )}
                    {errors.image && (
                      <p className="text-red-500 text-sm">
                        {errors.image.message}
                      </p>
                    )}
                  </>
                );
              }}
            />

            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-medium">Số lượng mã *</label>
              <input
                type="number"
                placeholder="Nhập số lượng mã"
                {...register("usageLimit", {
                  required: "Bắt buộc",
                  min: { value: 1, message: "Phải lớn hơn 0" },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.usageLimit && (
                <p className="text-red-500 text-sm">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Số lượt dùng / người *</label>
              <input
                type="number"
                placeholder="Nhập số lượt dùng"
                {...register("perUserLimit", {
                  required: "Bắt buộc",
                  min: { value: 1, message: "Phải lớn hơn 0" },
                  validate: (value) => {
                    const usageLimit = Number(getValues("usageLimit"));
                    if (Number(value) > usageLimit)
                      return "Lượt người dùng phải nhỏ hơn số lượng mã";
                    return true;
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.perUserLimit && (
                <p className="text-red-500 text-sm">
                  {errors.perUserLimit.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Giá trị đơn tối thiểu *</label>
              <input
                type="number"
                placeholder="Nhập số tiền tối thiểu"
                {...register("minOrderValue", {
                  required: "Bắt buộc",
                  min: {
                    value: 0,
                    message: "Giá trị đơn tối thiểu không được nhỏ hơn 0",
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.minOrderValue && (
                <p className="text-red-500 text-sm">
                  {errors.minOrderValue.message}
                </p>
              )}
            </div>
          </div>
          {discountType === "percent" && (
            <div>
              <label className="font-medium">Giá trị giảm tối đa</label>
              <input
                type="number"
                {...register("maxDiscountAmount", {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Giá trị giảm tối đa phải lớn hơn 0",
                  },
                })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.maxDiscountAmount && (
                <p className="text-red-500 text-sm">
                  {errors.maxDiscountAmount.message}
                </p>
              )}
            </div>
          )}
          {/* Multi-select categories đẹp */}
          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="w-full border px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setIsOpenModalCreateVoucher(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-green-700 w-full text-white flex items-center justify-center rounded-md px-4 py-2 cursor-pointer"
            >
              Thêm voucher
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalCreateVoucher;

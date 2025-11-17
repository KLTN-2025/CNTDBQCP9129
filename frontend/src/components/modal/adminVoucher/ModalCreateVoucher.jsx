import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import voucherApi from "../../../api/voucherApi";
import productCategoryApi from "../../../api/productCategoryApi";

const ModalCreateVoucher = ({ isOpenModalCreateVoucher, setIsOpenModalCreateVoucher, setVouchers }) => {
  const [categories, setCategories] = useState([]);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
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
      maxDiscountAmount: 0,
      applicableCategories: [],
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productCategoryApi.getAll(); // trả về mảng {_id, name}
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
      data.maxDiscountAmount = Number(data.maxDiscountAmount);

      const response = await voucherApi.createVoucher(data);
      if (!response.message) {
        toast.success("Thêm voucher thành công!");
        setVouchers(prev => [...prev, response]);
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
        overlay: { backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 50 },
        content: { top: "3rem", left: "auto", right: "auto", bottom: "auto", padding: 0, border: "none", borderRadius: "0.5rem", width: "100%", maxWidth: "600px" },
      }}
    >
      <div className="bg-white rounded-md w-full flex flex-col select-none">
        <div className="w-full bg-green-700 text-white py-3 px-4">
          <p className="font-bold text-lg">Thêm voucher mới</p>
        </div>

        <form className="p-6 space-y-4 max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="font-medium">Mã voucher *</label>
            <input {...register("code", { required: "Mã voucher bắt buộc" })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
            {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
          </div>

          <div>
            <label className="font-medium">Mô tả *</label>
            <input {...register("description", { required: "Mô tả bắt buộc" })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium">Loại giảm giá *</label>
              <select {...register("discountType", { required: true })} className="w-full px-3 py-2 border rounded-lg">
                <option value="amount">Tiền</option>
                <option value="percent">Phần trăm</option>
              </select>
            </div>
            <div>
              <label className="font-medium">Giá trị giảm *</label>
              <input type="number" {...register("discountValue", { required: "Bắt buộc", min: { value: 1, message: "Phải > 0" } })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.discountValue && <p className="text-red-500 text-sm">{errors.discountValue.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium">Ngày bắt đầu *</label>
              <input type="datetime-local" {...register("startDate", { required: "Ngày bắt đầu bắt buộc" })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="font-medium">Ngày kết thúc *</label>
              <input type="datetime-local" {...register("endDate", { required: "Ngày kết thúc bắt buộc" })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
          </div>

          <div>
            <label className="font-medium">Hình ảnh *</label>
            <input {...register("image", { required: "URL ảnh bắt buộc" })} className="w-full px-3 py-2 border rounded-lg"/>
            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-medium">Số lượng mã *</label>
              <input type="number" {...register("usageLimit", { required: "Bắt buộc", min: { value: 1, message: "Phải > 0" } })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.usageLimit && <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>}
            </div>

            <div>
              <label className="font-medium">Số lần dùng / người *</label>
              <input type="number" {...register("perUserLimit", { required: "Bắt buộc", min: { value: 1, message: "Phải > 0" } })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.perUserLimit && <p className="text-red-500 text-sm">{errors.perUserLimit.message}</p>}
            </div>

            <div>
              <label className="font-medium">Giá trị đơn tối thiểu *</label>
              <input type="number" {...register("minOrderValue", { required: "Bắt buộc", min: { value: 0, message: "Phải ≥ 0" } })} className="w-full px-3 py-2 border rounded-lg"/>
              {errors.minOrderValue && <p className="text-red-500 text-sm">{errors.minOrderValue.message}</p>}
            </div>
          </div>

          <div>
            <label className="font-medium">Giá trị giảm tối đa (không bắt buộc)</label>
            <input type="number" {...register("maxDiscountAmount", { min: 0 })} className="w-full px-3 py-2 border rounded-lg"/>
          </div>

          {/* Multi-select categories đẹp */}
          <div>
            <label className="font-medium mb-1 block">Danh mục áp dụng</label>
            <Controller
              name="applicableCategories"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categories.map(c => ({ value: c._id, label: c.name }))}
                  isMulti
                  placeholder="Chọn danh mục..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selected) => field.onChange(selected.map(s => s.value))}
                  value={categories
                    .filter(c => field.value.includes(c._id))
                    .map(c => ({ value: c._id, label: c.name }))}
                />
              )}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="w-full border px-4 py-2 rounded-md" onClick={() => setIsOpenModalCreateVoucher(false)}>Hủy</button>
            <button type="submit" className="bg-green-700 w-full text-white flex items-center justify-center rounded-md px-4 py-2">Thêm voucher</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalCreateVoucher;

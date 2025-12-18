import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import contactApi from "../../api/contactApi";
import { useEffect } from "react";
const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  useEffect(() => {
      document.title = `Liên hệ chúng tôi`;
  }, []);
 const onSubmit = async (data) => {
  console.log(data);
  
  try {
    await contactApi.createContact(data)
    Swal.fire({
      title: "Thành công!",
      text: "Bạn đã gửi thông tin!",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Lỗi!",
      text: "Đã xảy ra lỗi! Vui lòng thử lại.",
      icon: "error",
      confirmButtonText: "Thử lại",
    });
  } finally {
    reset();
  }
};

  return (
    <div className="mx-auto w-full ">
      <div className="w-full">
        <img
          src="/contact-banner1.png"
          className="w-full object-cover"
          alt="banner"
        />
      </div>
      <div className="flex mt-10 px-20 max-lg:flex-col max-lg:gap-y-6 max-lg:px-4 gap-x-12">
        <div className="flex flex-col w-full gap-y-2">
          <img
            src="/coffee-go-contact.png"
            className="object-cover w-[300px] h-[40px]"
            alt="cofee go"
          />
          <p className="text-orange-700 text-xs max-w-md">
            “Chúng tôi luôn luôn đặt sự hài lòng của bạn làm trọng tâm, mang đến
            dịch vụ trọn vẹn từ chất lượng đến trải nghiệm.”
          </p>
          <p className="max-w-md">
            <span className="text-orange-600">VPGG: </span> Tầng 6, Toà nhà
            Toyota, Số 12 Bạch Đằng, Q.Hải Châu, TP Đà Nẵng, Việt Nam
          </p>
          <p className="max-w-md">
            <span className="text-orange-600">Email: </span> support@gmal.com
          </p>
          <p className="max-w-md">
            <span className="text-orange-600">SĐT VP: </span> 1800666222
          </p>
          <img src="/view-shop5.jpg" className="rounded-md" alt="" />
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
              <input
                className="border w-full p-4 rounded-full border-gray-600 outline-none"
                {...register("name", { required: "Vui lòng nhập tên" })}
                placeholder="Tên của bạn"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <input
                className="border w-full p-4 rounded-full border-gray-600 outline-none"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                placeholder="Email của bạn"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                className="border w-full p-4 rounded-full border-gray-600 outline-none"
                {...register("phone", {
                  required: "Vui lòng nhập số điện thoại",
                  pattern: {
                    value: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                })}
                placeholder="Số điện thoại của bạn"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <textarea
                rows="4"
                className="border w-full p-4 rounded-lg border-gray-600 outline-none resize-none"
                {...register("message", { required: "Vui lòng nhập nội dung" })}
                placeholder="Nội dung"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-xl cursor-pointer rounded-full font-semibold"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Clock, Users, User, Phone, Mail, MessageSquare } from "lucide-react";
import reservationApi from "../../api/reservationApi";
import { useEffect } from "react";

// Utility function để tạo time slots
function getDeliverySlots() {
  const now = new Date();
  let startHour = now.getHours();
  let startMinute = now.getMinutes();

  const firstHour = 8;
  const lastHour = 22;

  if (startHour < firstHour) {
    startHour = firstHour;
    startMinute = 0;
  } else {
    if (startMinute >= 30) {
      startHour += 1;
      startMinute = 0;
    } else {
      startMinute = 30;
    }
  }

  if (startHour >= lastHour) return [];

  const slots = [];

  for (let h = startHour; h < lastHour; h++) {
    for (let m = h === startHour ? startMinute : 0; m < 60; m += 30) {
      slots.push(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      );
    }
  }

  return slots;
}

const ReservationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate time slots
  const timeSlots = useMemo(() => getDeliverySlots(), []);

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: getTodayDate(),
      time: timeSlots[0] || "",
      people: 1,
      note: "",
    },
  });
  useEffect(() => {
    document.title = "Đặt bàn";
  }, []);
  const onSubmit = async (data) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Format payload đúng với controller
      const payload = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        date: data.date,
        time: data.time,
        people: Number(data.people),
        note: data.note || "",
      };

      await reservationApi.create(payload);

      setIsSuccess(true);
      reset({
        name: "",
        phone: "",
        email: "",
        date: getTodayDate(),
        time: timeSlots[0] || "",
        people: 1,
        note: "",
      });

      // Reset success state sau 5s
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Đặt bàn thất bại. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Đặt Bàn Coffee Go
          </h1>
          <p className="text-gray-600 text-lg">
            Đặt chỗ trước để có trải nghiệm tốt nhất
          </p>
          <div className="mt-4 inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            🕐 Giờ mở cửa: 8:00 - 23:00 (Chỉ đặt trong ngày)
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Section - Bên trái */}
          <div className="lg:col-span-1">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-sm text-gray-700">
              <p className="font-semibold text-amber-800 mb-4 text-lg">
                📌 Lưu ý quan trọng:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Chỉ nhận đặt bàn trong ngày từ 8h đến 22h</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Đặt bàn trước ít nhất 30 phút</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>
                    Vui lòng đến đúng giờ để đảm bảo chỗ ngồi. Chúng tôi sẽ hủy
                    bàn nếu bạn đi trễ quá 15 phút
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>
                    Liên hệ hotline nếu cần hỗ trợ:{" "}
                    <span className="font-semibold text-amber-900">
                      (0236)123456
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form Section - Bên phải */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
              {/* Name & Phone - Ngang trên màn hình lớn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <User className="w-5 h-5 text-orange-600" />
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Vui lòng nhập họ tên",
                      minLength: {
                        value: 2,
                        message: "Tên phải có ít nhất 2 ký tự",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Phone className="w-5 h-5 text-orange-600" />
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^0[0-9]{9,10}$/,
                        message:
                          "Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10-11 số)",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0123456789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email & Date - Ngang trên màn hình lớn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Mail className="w-5 h-5 text-orange-600" />
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Vui lòng nhập email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Date */}
               <div>
                  <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Ngày *
                  </label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    max={getTodayDate()}
                    disabled
                    {...register("date", {
                      required: "Vui lòng chọn ngày",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition bg-gray-100 cursor-not-allowed ${
                      errors.date ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Time Select - Full width ở dưới */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Giờ (8h-22h) *
                </label>
                <select
                  {...register("time", {
                    required: "Vui lòng chọn giờ",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition cursor-pointer ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))
                  ) : (
                    <option value="">Hết giờ đặt hôm nay</option>
                  )}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>

              {/* People - Full width */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  Số người *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  {...register("people", {
                    required: "Vui lòng nhập số người",
                    min: { value: 1, message: "Tối thiểu 1 người" },
                    max: { value: 20, message: "Tối đa 20 người" },
                    valueAsNumber: true,
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition ${
                    errors.people ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1"
                />
                {errors.people && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.people.message}
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  Ghi chú
                </label>
                <textarea
                  {...register("note")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition resize-none"
                  placeholder="Yêu cầu đặc biệt, vị trí ngồi mong muốn..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold py-4 rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đặt Bàn Ngay"
                )}
              </button>
            </form>

            {/* Success Message ở dưới form */}
            <div
              className={`mt-6 bg-green-50 border-2 border-green-400 rounded-lg p-5 shadow-lg transition-all duration-300 ${
                isSuccess
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500 rounded-full p-2 animate-bounce">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg">
                    Đặt bàn thành công!
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    Chúng tôi sẽ giữ bàn cho bạn. Cảm ơn bạn đã tin tưởng!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;

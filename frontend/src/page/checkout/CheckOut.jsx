import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { PiNotepadFill } from "react-icons/pi";
import getDeliverySlots from "../../hooks/deliveryTime";
import useAuthStore from "../../store/authStore";
import "../../css/checkBox.css";
import useCartStore from "../../store/cartStore";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { toast } from "react-toastify";
import cartApi from "../../api/cartApi";
import ModalUpdateProduct from "../../components/modal/customerProduct/ModalUpdateProduct";
import voucherApi from "../../api/voucherApi";
import { BsFillTagFill } from "react-icons/bs";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import paymentApi from "../../api/paymentApi";

const CheckOut = () => {
  const { user } = useAuthStore();
  const [timeSlots, setTimeSlots] = useState([]);
  const [receiveMethod, setReceiveMethod] = useState("delivery");
  const { cart, setCart } = useCartStore();
  const [itemUpdate, setItemUpdate] = useState();
  const [isOpenModalUpdateItem, setIsOpenModalUpdateItem] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherUsed, setVoucherUsed] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phoneNumber: "",
      address: "",
      deliveryNote: "",
    },
  });

  useEffect(() => {
    setTimeSlots(["Càng sớm càng tốt", ...getDeliverySlots()]);
  }, []);

  const subTotal = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum +
        item.productId.price *
          (1 - item.productId.discount / 100) *
          item.quantity,
      0
    );
  }, [cart]);

  const total = useMemo(() => {
    if (receiveMethod === "delivery") {
      return cart.reduce(
        (sum, item) =>
          sum +
          item.productId.price *
            (1 - item.productId.discount / 100) *
            item.quantity,
        20000
      );
    }
    return cart.reduce(
      (sum, item) =>
        sum +
        item.productId.price *
          (1 - item.productId.discount / 100) *
          item.quantity,
      0
    );
  }, [cart, receiveMethod]);

  useEffect(() => {
    if (voucherCode.trim() === "") {
      setError("");
    }
  }, [voucherCode]);

  const handleClickRemoveProduct = async (item) => {
    try {
      await cartApi.removeCartItem(user.id, {
        productId: item.productId._id,
        note: item.note,
      });
      const newCart = cart.filter(
        (product) => product.productId._id !== item.productId._id
      );
      if (newCart.length === 0) {
        navigate("/menu");
      }
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleClickApplyVoucher = async () => {
    try {
      if (voucherCode.trim() === "") return;
      const data = {
        voucherCode,
        items: cart.map((item) => item.productId.productCategoryId),
        total: subTotal,
        userId: user.id,
      };
      const res = await voucherApi.applyVoucher(data);
      console.log(res);
      setVoucherCode("");
      setDiscount(res.discount);
      setVoucherUsed(res);
      setError("");
    } catch (err) {
      setError(err.response.data.message || "Lỗi áp dụng voucher");
      console.log(err);
    }
  };

  const handleClickRemoveVoucher = () => {
    setDiscount(0);
    setVoucherUsed("");
  };

  const handleClickOrder = async (data) => {
    try {
      const orderData = {
        cartItems: cart.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          note: item.note || "",
        })),
        delivery: {
          address: data.address || null,
          name: data.name,
          phone: data.phoneNumber,
          note: data.deliveryNote || "",
        },
        voucher: voucherUsed,
        userId: user.id,
      };
      console.log("orderData", orderData);
      const response = await paymentApi.createPayment(orderData);
      if (response.success && response.vnpUrl) {
        window.location.href = response.vnpUrl;
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error(error.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  return (
    <div className="mx-auto max-lg:px-4 px-40 py-10 w-full">
      <div className="w-full flex items-center justify-center gap-x-2">
        <PiNotepadFill className="text-2xl text-orange-600" />
        <h1 className="text-2xl font-semibold">Xác nhận đơn hàng</h1>
      </div>
      <div className="pt-10">
        <h2 className="font-semibold text-xl py-2">Giao hàng</h2>
        <hr className="w-[3rem] border-2 border-orange-600" />
        <span className="text-xs text-orange-500">
          Chúng tôi chỉ nhận đơn hàng trong ngày và trong khu vực quanh quán,
          với bán kính tối đa 10 km.
        </span>
      </div>
      <div className="flex max-lg:pt-4 w-full gap-x-8 max-lg:flex-col max-lg: gap-y-8">
        <div className="w-full">
          <div className="pt-2">
            <p className="font-semibold">Nhận hàng trong ngày 15-30 phút</p>
            <div className="flex items-center gap-x-2">
              <p>Vào lúc:</p>
              <select className="cursor-pointer outline-0">
                {timeSlots.map((timeSlot, index) => (
                  <option key={index} value={timeSlot}>
                    {timeSlot}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <p className="whitespace-nowrap">Cách nhận hàng:</p>
              <select
                id="receiveMethod"
                value={receiveMethod}
                onChange={(e) => setReceiveMethod(e.target.value)}
                className="pl-2 focus:outline-0 cursor-pointer"
              >
                <option value="delivery">Giao tận nơi</option>
                <option value="pickup">Đến quán lấy</option>
              </select>
            </div>
          </div>

          {/* FORM THÔNG TIN NGƯỜI NHẬN */}
          <form
            id="checkoutForm"
            onSubmit={handleSubmit(handleClickOrder)}
            className="space-y-6 pt-4"
          >
            {receiveMethod === "delivery" && (
              <div className="flex pt-4 gap-x-10 items-center">
                <img
                  src="delivery.png"
                  className="w-15 h-15 object-cover"
                  alt="giao hàng"
                />
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    {...register("address", {
                      required: "Địa chỉ giao hàng bắt buộc",
                    })}
                    placeholder="Nhập địa chỉ giao hàng"
                    className="h-8 focus:outline-none border w-full border-gray-500 rounded-xl pl-4"
                  />
                  {errors.address && (
                    <p className="text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            <input
              type="text"
              {...register("name", {
                required: "Tên người nhận bắt buộc",
                pattern: {
                  value: /^[A-Za-zÀ-ỹ\s]+$/, // chỉ cho phép chữ cái và khoảng trắng (có dấu tiếng Việt)
                  message: "Tên không được có số và ký tự đặc biệt",
                },
              })}
              placeholder="Tên người nhận"
              className="pl-4 placeholder:text-gray-400 border border-gray-200 py-2 w-full focus:outline-0"
            />
            {errors.name && (
              <p className="text-red-600">{errors.name.message}</p>
            )}
            <input
              type="text"
              {...register("phoneNumber", {
                required: "Số điện thoại bắt buộc",
                pattern: {
                  value: /^\d{10}$/, // chỉ đúng 10 chữ số
                  message: "Số điện thoại phải đúng 10 chữ số",
                },
              })}
              placeholder="Số điện thoại"
              className="pl-4 placeholder:text-gray-400 border border-gray-200 py-2 w-full focus:outline-0"
            />
            {errors.phoneNumber && (
              <p className="text-red-600">{errors.phoneNumber.message}</p>
            )}
            {receiveMethod === "delivery" && (
              <input
                type="text"
                {...register("deliveryNote")}
                placeholder="Hướng dẫn giao hàng"
                className="pl-4 placeholder:text-gray-400 border border-gray-200 py-2 w-full focus:outline-0"
              />
            )}

            {/* Nút đặt hàng */}
          </form>

          {/* PHẦN CÒN LẠI GIỮ NGUYÊN */}
          <div className="pt-5">
            <p className="semibold text-xl py-2">Phương thức thanh toán</p>
            <hr className="w-[3rem] border-2 border-orange-600" />
            <div className="flex items-center gap-x-10 pt-4">
              <div className="checkbox-wrapper">
                <input checked={true} type="checkbox" />
                <svg viewBox="0 0 35.6 35.6" width="25" height="25">
                  <circle
                    className="background"
                    cx="17.8"
                    cy="17.8"
                    r="17.8"
                  ></circle>
                  <circle
                    className="stroke"
                    cx="17.8"
                    cy="17.8"
                    r="10.37"
                  ></circle>
                  <polyline
                    className="check"
                    points="11.78 18.12 15.55 22.23 25.17 12.87"
                  ></polyline>
                </svg>
              </div>
              <div className="flex items-center">
                <img
                  src="logo-vnpay.png"
                  className="h-6 w-10 object-cover"
                  alt="vnpay"
                />
                <p className="text-lg font-light">VNPAY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order sản phẩm */}
        <div className="w-full">
          <div className="w-full card pt-2">
            <div className="flex items-center w-full justify-between px-4">
              <p className="text-xl font-semibold">Các món đã chọn</p>
              <Link to="/menu">
                <button className="px-4 py-1 rounded-full border cursor-pointer bg-amber-600 text-white">
                  Thêm món
                </button>
              </Link>
            </div>
            <hr className="w-[3rem] border-2 border-orange-600 ml-4" />
            <div className="space-y-2 mt-4 w-full px-4">
              {cart.length > 0 &&
                cart.map((item) => (
                  <div
                    className="flex space-x-4 w-full"
                    key={item.productId._id}
                  >
                    <img
                      src={item.productId.image}
                      className="h-20 w-20 border rounded-md border-gray-200"
                      alt={item.productId.name}
                    />
                    <div className="space-y-1 flex-1">
                      <p>
                        {item.quantity} x {item.productId.name}
                      </p>
                      {item.note && (
                        <p className="whitespace-break-spaces">
                          Note: {item.note}
                        </p>
                      )}
                      <div className="space-x-4 flex">
                        <button
                          className="text-xl text-red-700 cursor-pointer"
                          title="Xóa sản phẩm"
                          onClick={() => handleClickRemoveProduct(item)}
                        >
                          <MdDelete />
                        </button>
                        <button
                          className="text-xl text-orange-500 cursor-pointer"
                          title="Chỉnh sửa sản phẩm"
                          onClick={() => {
                            setItemUpdate(item);
                            setIsOpenModalUpdateItem(true);
                          }}
                        >
                          <MdModeEdit />
                        </button>
                      </div>
                    </div>
                    <div className="w-[100px] font-bold">
                      {formatCurrencyVN(
                        item.productId.price *
                          (1 - item.productId.discount / 100) *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="pt-10">
              <p className="text-xl font-semibold px-4 pr-6">Tổng cộng</p>
              <hr className="w-[3rem] border-2 border-orange-600 ml-4" />
              <div className="pt-4 flex w-full justify-between px-4 pr-6">
                <p className="text-gray-600">Tạm tính:</p>
                <p className="font-bold">{formatCurrencyVN(subTotal)}</p>
              </div>
              {receiveMethod === "delivery" && (
                <div className="pt-4 flex w-full justify-between px-4 pr-6">
                  <p className="text-gray-600">Phí giao hàng:</p>
                  <p className="font-bold">{formatCurrencyVN(20000)}</p>
                </div>
              )}
              <div className="flex flex-col px-4 mt-4">
                <div className="flex items-center gap-x-4">
                  <input
                    type="text"
                    value={voucherCode}
                    className={`border-2 py-2 rounded-sm w-full ${
                      error ? "border-red-700" : "border-gray-300"
                    }  pl-2 focus:border-orange-500 focus:outline-none`}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    onPaste={(e) => setVoucherCode(e.target.value)}
                  />
                  <button
                    className={`${
                      voucherCode.trim() === ""
                        ? "bg-orange-300"
                        : "bg-orange-600"
                    } text-white px-4 py-2 whitespace-nowrap rounded-sm cursor-pointer`}
                    onClick={handleClickApplyVoucher}
                  >
                    Áp dụng
                  </button>
                </div>
                {error && <p className="text-red-600">{error}</p>}
                {voucherUsed && (
                  <div className="pl-4 pr-2 flex relative gap-x-2 py-2 max-w-[200px] bg-gray-300 rounded-sm mt-4">
                    <BsFillTagFill className="text-xl mt-1" />
                    <p>
                      {voucherUsed.voucherCode}
                    </p>
                    <IoMdRemoveCircleOutline
                      className=" cursor-pointer right-1 absolute"
                      onClick={handleClickRemoveVoucher}
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-bl-lg rounded-br-lg px-4 items-center py-2 flex w-full justify-between bg-orange-500 text-white">
                <div>
                  <p>Thành tiền</p>
                  <p className="font-bold">
                    {formatCurrencyVN(total - discount)}
                  </p>
                </div>
                <button
                  type="submit"
                  form="checkoutForm"
                  className="px-5 py-2 bg-white text-orange-500 rounded-full cursor-pointer"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenModalUpdateItem && (
        <ModalUpdateProduct
          itemUpdate={itemUpdate}
          isOpenModalUpdateItem={isOpenModalUpdateItem}
          setIsOpenModalUpdateItem={setIsOpenModalUpdateItem}
        />
      )}
    </div>
  );
};

export default CheckOut;

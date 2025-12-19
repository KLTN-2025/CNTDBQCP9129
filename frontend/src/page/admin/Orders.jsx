import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import orderApi from "../../api/orderApi";
import { io } from "socket.io-client";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import playTingSound from "../../utils/playTingSound";
import { AiOutlineEye } from "react-icons/ai";
import { BsClipboardCheckFill } from "react-icons/bs";
import ModalOrderDetail from "../../components/modal/adminOrders/ModalDetailOrder";
import ModalConfirmCompleteOrder from "../../components/modal/adminOrders/ModalConfirmCompleteOrder";
import { getTodayString } from "../../utils/getTodayString";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isOpenConfirmComplete, setIsOpenConfirmComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [orderTypeFilter, setOrderTypeFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("DESC");


  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  const loadOrders = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders({
        startDate,
        endDate,
      });
      setOrders(res.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [startDate, endDate]);

  // Socket setup - chỉ mount 1 lần
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      socket.emit("join_admin");
    });

    socket.on("order_changed", (change) => {
      if (change.type === "insert") {
          setOrders((prev) => [change.data, ...prev]);
        playTingSound();
        if (document.hidden) {
          setNewOrderCount((prev) => prev + 1);
        }

        const orderType =
          change.data.orderType === "ONLINE" ? "Online" : "Tại quán";
        const statusText =
          change.data.status === "PROCESSING"
            ? "Đang xử lý"
            : change.data.status === "COMPLETED"
            ? "Hoàn tất"
            : "Đã hủy";
        toast.success(`Đơn ${orderType} mới - ${statusText}!`);
      } else if (change.type === "update") {
        setOrders((prev) =>
          prev.map((o) => {
            if (o._id === change.orderId) {
              if (change.updatedFields.paymentStatus === "FAILED") {
                return { ...o, paymentStatus: "FAILED", status: "CANCELLED" };
              } else if (change.updatedFields.paymentStatus === "SUCCESS") {
                return {
                  ...o,
                  paymentStatus: "SUCCESS",
                  vnp_Amount: change.data.vnp_Amount,
                  vnp_PayDate: change.data.vnp_PayDate,
                  vnp_TransactionNo: change.data.vnp_TransactionNo,
                };
              }
            }
            return o;
          })
        );
      } else if (change.type === "delete") {
        setOrders((prev) => prev.filter((o) => o._id !== change.orderId));
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, []); // mount 1 lần

  useEffect(() => {
    if (newOrderCount > 0) {
      document.title = `(${newOrderCount}) Đơn hàng mới`;
    } else {
      document.title = "Quản lý đơn hàng";
    }
  }, [newOrderCount]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNewOrderCount(0);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Filter và sort orders dùng useMemo
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        if (statusFilter !== "ALL" && order.status !== statusFilter)
          return false;
        if (orderTypeFilter !== "ALL" && order.orderType !== orderTypeFilter)
          return false;
        if (paymentFilter !== "ALL" && order.paymentStatus !== paymentFilter)
          return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
      });
  }, [orders, statusFilter, orderTypeFilter, paymentFilter, sortOrder]);

  // Đếm số lượng theo trạng thái
  const statusCounts = {
    ALL: orders.length,
    PROCESSING: orders.filter((o) => o.status === "PROCESSING").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const res = await orderApi.completeOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.status } : o))
      );
      toast.success("Đơn hàng đã hoàn thành");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    } finally {
      setIsOpenConfirmComplete(false);
    }
  };

  const handleQuickDate = (type) => {
    const today = new Date();
    const todayStr = getTodayString();

    switch (type) {
      case "today":
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        const str = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(y.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(str);
        break;
      }
      case "week": {
        const w = new Date(today);
        w.setDate(today.getDate() - 7);
        const str = `${w.getFullYear()}-${String(w.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(w.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(todayStr);
        break;
      }
      case "month": {
        const m = new Date(today);
        m.setDate(today.getDate() - 30); // chính xác 30 ngày
        const str = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(m.getDate()).padStart(2, "0")}`;
        setStartDate(str);
        setEndDate(todayStr);
        break;
      }
    }
  };

  return (
    <div className="w-full mx-auto bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quản lý đơn hàng
              {newOrderCount > 0 && (
                <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
                  {newOrderCount} mới
                </span>
              )}
            </h2>
            <p className="text-gray-600 mt-1">
              Danh sách đơn hàng ({filteredOrders.length} đơn)
            </p>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          {/* Quick buttons */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {[
              { key: "today", label: "Hôm nay" },
              { key: "yesterday", label: "Hôm qua" },
              { key: "week", label: "7 ngày" },
              { key: "month", label: "30 ngày" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => handleQuickDate(btn.key)}
                className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={getTodayString()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Tabs trạng thái đơn hàng */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "ALL", label: "Tất cả", color: "bg-gray-100 text-gray-800" },
            {
              key: "PROCESSING",
              label: "Đang xử lý",
              color: "bg-yellow-100 text-yellow-800",
            },
            {
              key: "COMPLETED",
              label: "Hoàn tất",
              color: "bg-green-100 text-green-800",
            },
            {
              key: "CANCELLED",
              label: "Đã hủy",
              color: "bg-red-100 text-red-800",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                statusFilter === tab.key
                  ? `${tab.color} ring-2 ring-offset-1`
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({statusCounts[tab.key]})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại đơn
            </label>
            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Tại quán</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thanh toán
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả</option>
              <option value="PENDING">Đang chờ</option>
              <option value="SUCCESS">Thành công</option>
              <option value="FAILED">Thất bại</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sắp xếp
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
            >
              <option value="DESC">Mới nhất</option>
              <option value="ASC">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Mã đơn",
                "Loại",
                "Thời gian",
                "Tổng tiền",
                "Số lượng món",
                "Thanh toán",
                "Trạng thái",
                "Thao tác",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-mono">
                  #{order._id?.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {order.orderType === "ONLINE" ? (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                      ONLINE
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      TẠI QUÁN
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {formatDatetimeVN(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  {formatCurrencyVN(order.totalPrice)}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-medium">
                    {order.items.length} món
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-semibold
                      ${
                        order.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""
                      }
                      ${
                        order.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }
                      ${
                        order.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-700"
                          : ""
                      }
                    `}
                  >
                    {order.paymentStatus === "PENDING" && "Đang chờ"}
                    {order.paymentStatus === "SUCCESS" && "Hoàn tất"}
                    {order.paymentStatus === "FAILED" && "Thất bại"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold inline-block whitespace-nowrap
                      ${
                        order.status === "PROCESSING"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        order.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                    `}
                  >
                    {order.status === "PROCESSING" && "Đang xử lý"}
                    {order.status === "COMPLETED" && "Hoàn tất"}
                    {order.status === "CANCELLED" && "Đã hủy"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-orange-600 hover:text-orange-800 transition-colors cursor-pointer"
                      title="Xem chi tiết đơn hàng"
                      onClick={() => {
                        setOrderData(order);
                        setIsOpenModalDetail(true);
                      }}
                    >
                      <AiOutlineEye className="w-6 h-6" />
                    </button>
                    {order.paymentStatus === "SUCCESS" &&
                      order.status === "PROCESSING" && (
                        <button
                          className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                          title="Hoàn thành đơn hàng"
                          onClick={() => {
                            setIsOpenConfirmComplete(true);
                            setOrderData(order);
                          }}
                        >
                          <BsClipboardCheckFill className="w-5 h-5" />
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-500 mt-2">Đang tải đơn hàng...</p>
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Không có đơn hàng nào trong khoảng thời gian này
          </div>
        )}
      </div>

      {isOpenModalDetail && (
        <ModalOrderDetail
          isOpenModal={isOpenModalDetail}
          setIsOpenModal={setIsOpenModalDetail}
          orderData={orderData}
        />
      )}
      {isOpenConfirmComplete && (
        <ModalConfirmCompleteOrder
          isOpenConfirmComplete={isOpenConfirmComplete}
          setIsOpenConfirmComplete={setIsOpenConfirmComplete}
          orderData={orderData}
          onConfirm={() => handleCompleteOrder(orderData._id)}
        />
      )}
    </div>
  );
}

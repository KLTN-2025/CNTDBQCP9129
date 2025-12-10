import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
} from "lucide-react";
import orderApi from "../../api/orderApi";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import useAuthStore from "../../store/authStore";
import ModalOrderDetail from "../../components/modal/adminOrders/ModalDetailOrder";
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isOpenModalOrderDetail, setIsOpenModalOrderDetail] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { user } = useAuthStore();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderApi.getAllOrdersByUserId(user.id);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusConfig = (status) => {
    const configs = {
      COMPLETED: {
        label: "Đã nhận hàng",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle,
      },
      PROCESSING: {
        label: "Đang xử lý",
        color: "bg-yellow-100 text-yellow-700",
        icon: Clock,
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      },
    };
    return configs[status] || configs.PROCESSING;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center overflow-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi các đơn hàng của bạn
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {[
            { value: "all", label: "Tất cả" },
            { value: "PROCESSING", label: "Đang xử lý" },
            { value: "COMPLETED", label: "Đã nhận hàng" },
            { value: "CANCELLED", label: "Đã hủy" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                filter === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có đơn hàng
            </h3>
            <p className="text-gray-600">
              Bạn chưa có đơn hàng nào trong mục này
            </p>
          </div>
        ) : (
          <div className="space-y-4 h-[50vh] overflow-auto">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Mã đơn hàng</p>
                        <p className="font-semibold text-gray-900">
                          #{order._id.slice(-8)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDatetimeVN(order.createdAt)}
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
                    <button
                      className="text-blue-600 font-medium hover:text-blue-700 transition-colors cursor-pointer"
                      onClick={() => {
                        setIsOpenModalOrderDetail(true);
                        setOrderData(order);
                      }}
                    >
                      Xem chi tiết
                    </button>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Tổng tiền</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {isOpenModalOrderDetail && (
        <ModalOrderDetail
          isOpenModal={isOpenModalOrderDetail}
          setIsOpenModal={setIsOpenModalOrderDetail}
          orderData={orderData}
        />
      )}
    </div>
  );
};

export default OrderHistory;

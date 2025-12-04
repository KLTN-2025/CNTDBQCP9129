import { useEffect, useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import orderApi from "../../api/orderApi";
import { io } from "socket.io-client";
import { formatCurrencyVN } from "../../utils/formatCurrencyVN";
import { formatDatetimeVN } from "../../utils/formatDatetimeVN";
import playTingSound from "../../utils/playTingSound";
import { AiOutlineEye } from "react-icons/ai";
import { BsClipboardCheckFill } from "react-icons/bs";
import ModalOrderDetail from "../../components/modal/adminOrders/ModalDetailOrder";
export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [orderData, setOrderData] = useState(null)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const loadOrders = async (pageNum, isInitial = false) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const res = await orderApi.getAllOrders({ page: pageNum, limit: 5 });
      
      if (isInitial) {
        setOrders(res.orders); // Lần đầu thì replace
      } else {
        setOrders(prev => [...prev, ...res.orders]); // Append thêm
      }
      
      setHasMore(res.hasMore);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const lastOrderRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Load orders khi page thay đổi
  useEffect(() => {
    loadOrders(page, page === 1);
  }, [page]);
  console.log("orders", orders);
  // Socket setup
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join_admin");
    });

    socket.on("order_changed", (change) => {
      console.log("Order changed:", change);

      if (change.type === "insert") {
        setOrders((prev) => [change.data, ...prev]); // Thêm vào đầu
        playTingSound();
        if (document.hidden) {
          setNewOrderCount(prev => prev + 1);
        }
        toast.success("🎉 Có đơn hàng mới!");
      } 
      else if (change.type === "update") {
        setOrders((prev) => (
          prev.map((o) => {
            if(o._id === change.orderId){
              if(change.updatedFields.paymentStatus === 'FAILED'){
                return {...o, paymentStatus: "FAILED", status:"CANCELLED"}
              }else if(change.updatedFields.paymentStatus === "SUCCESS") {
                return {...o, paymentStatus: "SUCCESS"}
              }
            }
            return o;
          })
        ));
      } 
      else if (change.type === "delete") {
        setOrders((prev) => prev.filter((o) => o._id !== change.orderId));
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  // Cập nhật tab title
  useEffect(() => {
    if (newOrderCount > 0) {
      document.title = `(${newOrderCount}) Đơn hàng mới`;
    } else {
      document.title = "Quản lý đơn hàng";
    }
  }, [newOrderCount]);

  // Reset badge khi quay lại tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNewOrderCount(0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Filter orders theo search
  const filteredOrders = orders.filter((order) =>
    order.delivery?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-gray-600 mt-1">Danh sách đơn hàng</p>
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Thời gian",
                "Tổng tiền",
                "Tiền khuyến mãi",
                "Thông tin giao hàng",
                "Sản phẩm",
                "Tình trạng thanh toán",
                "Tình trạng đơn hàng",
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
              <tr 
                key={order._id} 
                className="hover:bg-gray-50"
                ref={index === filteredOrders.length - 1 ? lastOrderRef : null} 
              >
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">
                  {formatDatetimeVN(order.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {formatCurrencyVN(order.totalPrice)}
                </td>
                <td className="px-6 py-4">
                  {formatCurrencyVN(order.voucherDiscount)}
                </td>
                <td className="px-6 py-4 text-sm max-w-[300px] whitespace-break-spaces">
                  <div className="flex flex-col">
                    <span>
                      <strong>Tên: </strong> {order.delivery.name}
                    </span>
                    <span>
                      <strong>Số điện thoại: </strong> {order.delivery.phone}
                    </span>
                    <span>
                      <strong>Địa chỉ: </strong>{" "}
                      {order.delivery.address || "Đến quán lấy"}
                    </span>
                    <span>
                      <strong>Hướng dẫn giao hàng: </strong>{" "}
                      {order.delivery.note || "Không có"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm max-w-[350px]">
                  <div className="flex flex-col space-y-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-1 border rounded bg-gray-50"
                      >
                        <p>
                          <strong>Tên món:</strong> {item.name}
                        </p>
                        <p>
                          <strong>Số lượng:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Ghi chú:</strong> {item.note || "Không có"}
                        </p>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`
                      ${order.paymentStatus === "PENDING" ? "text-yellow-500" : ""}
                      ${order.paymentStatus === "SUCCESS" ? "text-green-600" : ""}
                      ${order.paymentStatus === "FAILED" ? "text-red-600" : ""}
                      font-semibold
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
                      px-4 py-2 rounded-lg inline-block whitespace-nowrap
                      ${order.status === "PROCESSING" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${order.status === "COMPLETED" ? "bg-green-100 text-green-800" : ""}
                      ${order.status === "CANCELLED" ? "bg-red-100 text-red-800" : ""}
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
                      <button
                        className="text-green-600 hover:text-green-800 transition-colors cursor-pointer"
                        title="Hoàn thành đơn hàng"
                        // onClick={() => {
                        //   setBlogToUpdate(blog);
                        //   setIsOpenModalUpdateBlog(true);
                        // }}
                      >
                        <BsClipboardCheckFill className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <p className="text-gray-500 mt-2">Đang tải thêm đơn hàng...</p>
          </div>
        )}
        {!hasMore && orders.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            Đã hiển thị tất cả đơn hàng
          </div>
        )}
        {orders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Chưa có đơn hàng nào
          </div>
        )}
      </div>
      {isOpenModalDetail && (
        <ModalOrderDetail isOpenModal={isOpenModalDetail} setIsOpenModal={setIsOpenModalDetail} orderData={orderData}/>
      )}
    </div>
  );
}
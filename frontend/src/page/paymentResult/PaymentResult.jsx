import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { formatCurrencyVN } from '../../utils/formatCurrencyVN';
import { formatDatetimeVNOfVNPAY } from '../../utils/formatDatetimeVNOfVNPAY';
import orderApi from '../../api/orderApi';
import ErrorPage from '../../error/ErrorPage';
import { toast } from 'react-toastify';
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const getOrderById = async() => {
     try {
      const orderData = await orderApi.getOrderById(orderId);
      setOrder(orderData);
     } catch {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
     } finally {
      setLoading(false);
     }
    }
    getOrderById()
  }, [orderId]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }
  if(!order && !false){
    return <ErrorPage/>
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white  flex items-center justify-center p-4">
     <div className="max-w-md w-full">
        {/* SUCCESS */}
        {order?.paymentStatus === "SUCCESS" && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-500">
                Đơn hàng của bạn đã được xác nhận
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-semibold text-gray-800">
                  {order?._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              
              {order?.vnp_Amount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-green-600 text-xl">
                    {formatCurrencyVN(order.vnp_Amount)}
                  </span>
                </div>
              )}

              {order?.vnp_TransactionNo && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-sm text-gray-800">
                    {order?.vnp_TransactionNo}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian:</span>
                <span className="text-sm text-gray-800">
                  {formatDatetimeVNOfVNPAY(order?.vnp_PayDate)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/profile/orders-history`)}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Xem chi tiết đơn hàng
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>
          </div>
        )}
        {/* FAILED */}
        {order?.paymentStatus === 'FAILED' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-500">
                Giao dịch không thành công
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-6 mb-6 space-y-3">
              {order?._id && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono font-semibold text-gray-800">
                    {order?._id.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>
          </div>
        )}
        {/* ERROR */}
        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-orange-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Có lỗi xảy ra thanh toán thất bại
              </h1>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Về trang chủ
              </button>
            </div>
          </div>
        )} 
      </div>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentResult;
// PaymentResult.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { formatCurrencyVN } from '../../utils/formatCurrencyVN';
const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const transactionNo = searchParams.get('transactionNo');
  const message = searchParams.get('message');
  const code = searchParams.get('code');
  const payDate = searchParams.get('payDate');
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  const formatDatetimeVN = (vnpDateString) => {
  if (!vnpDateString) return "";

  // vnpDateString dạng: YYYYMMDDHHmmss
  const year = vnpDateString.substring(0, 4);
  const month = vnpDateString.substring(4, 6);
  const day = vnpDateString.substring(6, 8);
  const hour = vnpDateString.substring(8, 10);
  const minute = vnpDateString.substring(10, 12);
  const second = vnpDateString.substring(12, 14);

  // Ghép thành chuẩn ISO
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}+07:00`;

  const date = new Date(iso);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white  flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* SUCCESS */}
        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-500">
                {message || 'Đơn hàng của bạn đã được xác nhận'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-mono font-semibold text-gray-800">
                  {orderId?.slice(-8).toUpperCase()}
                </span>
              </div>
              
              {amount && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-bold text-green-600 text-xl">
                    {formatCurrencyVN(amount)}
                  </span>
                </div>
              )}

              {transactionNo && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-sm text-gray-800">
                    {transactionNo}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian:</span>
                <span className="text-sm text-gray-800">
                  {formatDatetimeVN(payDate)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/order/${orderId}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
        {status === 'failed' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Thanh toán thất bại
              </h1>
              <p className="text-gray-500">
                {message || 'Giao dịch không thành công'}
              </p>
            </div>

            <div className="bg-red-50 rounded-xl p-6 mb-6 space-y-3">
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono font-semibold text-gray-800">
                    {orderId.slice(-8).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian:</span>
                <span className="text-sm text-gray-800">
                  {formatDatetimeVN(payDate)}
                </span>
              </div>
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
            <div className="bg-orange-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <span className="text-gray-600 text-sm">Thời gian:</span>
              <span className="text-sm text-gray-800">
                {formatDatetimeVN(payDate)}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cart')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Quay lại giỏ hàng
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
import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import reservationApi from "../../api/reservationApi";
import ModalConfirmDelete from "../../components/modal/ModalConfirmDelete";
import ModalConfirm from "../../components/modal/adminReservation/ModalConfirm";
import { io } from "socket.io-client";
import playTingSound from "../../utils/playTingSound";

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [newReservationCount, setNewReservationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Date filter states
  const getTodayString = () => new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getTodayString());

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Load reservations theo date range
  const loadReservations = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await reservationApi.getAll({ startDate, endDate });
      setReservations(res.reservations || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi tải lịch hẹn"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load lần đầu và khi thay đổi date
  useEffect(() => {
    loadReservations();
  }, [startDate, endDate]);

  // Update document title when new reservations arrive
  useEffect(() => {
    if (newReservationCount > 0) {
      document.title = `(${newReservationCount}) Lịch hẹn mới`;
    } else {
      document.title = "Quản lý lịch hẹn";
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNewReservationCount(0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = "Quản lý lịch hẹn - Admin";
    };
  }, [newReservationCount]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      socket.emit("join_admin");
    });

    socket.on("reservation_changed", (change) => {
      if (change.type === "insert") {
        setReservations((prev) => [change.data, ...prev]);
        playTingSound();
        if (document.hidden) {
          setNewReservationCount((prev) => prev + 1);
        }
        toast.success("Có lịch hẹn mới!");
      } else if (change.type === "update") {
        setReservations((prev) =>
          prev.map((r) => (r._id === change.reservationId ? change.data : r))
        );
      } else if (change.type === "delete") {
        setReservations((prev) =>
          prev.filter((r) => r._id !== change.reservationId)
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Reservation socket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  // Quick date selections
  const handleQuickDate = (type) => {
    const todayStr = getTodayString();

    switch (type) {
      case "today":
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        setStartDate(yesterdayStr);
        setEndDate(yesterdayStr);
        break;
      }
      case "week": {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        setStartDate(weekAgo.toISOString().split("T")[0]);
        setEndDate(todayStr);
        break;
      }
      case "month": {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        setStartDate(monthAgo.toISOString().split("T")[0]);
        setEndDate(todayStr);
        break;
      }
    }
  };

  // Confirm reservation
  const handleConfirm = async () => {
    try {
      const res = await reservationApi.confirm(selectedReservation._id);
      setReservations((prev) => prev.map((r) => (r._id === res._id ? res : r)));
      toast.success("Xác nhận lịch hẹn thành công");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsOpenConfirm(false);
      setSelectedReservation(null);
    }
  };

  // Cancel reservation
  const handleCancel = async () => {
    try {
      const res = await reservationApi.cancel(selectedReservation._id);
      setReservations((prev) => prev.map((r) => (r._id === res._id ? res : r)));
      toast.success("Đã hủy lịch hẹn");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsOpenCancel(false);
      setSelectedReservation(null);
    }
  };

  // Delete reservation
  const handleDelete = async () => {
    try {
      await reservationApi.delete(selectedReservation._id);
      setReservations((prev) =>
        prev.filter((r) => r._id !== selectedReservation._id)
      );
      toast.success("Xóa lịch hẹn thành công");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsOpenDelete(false);
      setSelectedReservation(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý lịch hẹn</h2>
            <p className="text-gray-600 mt-1">
              Danh sách đặt lịch ({reservations.length} lịch hẹn)
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "STT",
                "Tên khách",
                "SĐT",
                "Ngày đặt",
                "Giờ đặt",
                "Số người",
                "Trạng thái",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {reservations
              .filter(
                (r) =>
                  r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  r.phone.includes(searchTerm)
              )
              .map((r, index) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.phone}</td>
                  <td className="px-6 py-4">{formatDate(r.date)}</td>
                  <td className="px-6 py-4">{r.time}</td>
                  <td className="px-6 py-4">{r.people}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        r.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status === "PENDING"
                        ? "Đang chờ khách"
                        : r.status === "COMPLETED"
                        ? "Khách đã đến"
                        : "Đã hủy"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {r.status === "PENDING" && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800 cursor-pointer"
                            title="Xác nhận"
                            onClick={() => {
                              setSelectedReservation(r);
                              setIsOpenConfirm(true);
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            className="text-orange-600 hover:text-orange-800 cursor-pointer"
                            title="Hủy lịch"
                            onClick={() => {
                              setSelectedReservation(r);
                              setIsOpenCancel(true);
                            }}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {(r.status === "COMPLETED" ||
                        r.status === "CANCELLED") && (
                        <button
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          title="Xóa"
                          onClick={() => {
                            setSelectedReservation(r);
                            setIsOpenDelete(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
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
            <p className="text-gray-500 mt-2">Đang tải lịch hẹn...</p>
          </div>
        )}

        {reservations.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            Không có lịch hẹn nào trong khoảng thời gian này
          </div>
        )}
      </div>

      {/* Modal Xác nhận lịch hẹn */}
      {isOpenConfirm && selectedReservation && (
        <ModalConfirm
          isOpen={isOpenConfirm}
          onClose={() => {
            setIsOpenConfirm(false);
            setSelectedReservation(null);
          }}
          onConfirm={handleConfirm}
          title="Xác nhận lịch hẹn"
          content={`Xác nhận lịch hẹn của ${selectedReservation.name}?`}
          confirmText="Xác nhận"
          confirmColor="green"
        />
      )}

      {/* Modal Hủy lịch hẹn */}
      {isOpenCancel && selectedReservation && (
        <ModalConfirm
          isOpen={isOpenCancel}
          onClose={() => {
            setIsOpenCancel(false);
            setSelectedReservation(null);
          }}
          onConfirm={handleCancel}
          title="Hủy lịch hẹn"
          content={`Hủy lịch hẹn của ${selectedReservation.name}?`}
          confirmText="Hủy lịch"
          confirmColor="orange"
        />
      )}

      {/* Modal Xóa lịch hẹn */}
      {isOpenDelete && selectedReservation && (
        <ModalConfirmDelete
          isOpenConfirmDelete={isOpenDelete}
          setIsOpenConfirmDelete={() => {
            setIsOpenDelete(false);
            setSelectedReservation(null);
          }}
          content={`Xóa lịch hẹn của ${selectedReservation.name}?`}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
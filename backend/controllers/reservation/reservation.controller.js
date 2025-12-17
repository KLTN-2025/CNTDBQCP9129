import Reservation from "../../model/reservation.model.js";

// GET ALL với date filter (mặc định hôm nay)
export const getAllReservations = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      dateFilter.createdAt = {
        $gte: start,
        $lte: end
      };
    } else {
      // MẶC ĐỊNH: Chỉ lấy lịch hẹn HÔM NAY
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      dateFilter.createdAt = {
        $gte: today,
        $lt: tomorrow
      };
    }

    const reservations = await Reservation.find(dateFilter)
      .sort({ createdAt: -1 });

    const total = reservations.length;

    res.json({
      reservations,
      total,
      dateRange: {
        start: startDate || new Date().toISOString().split('T')[0],
        end: endDate || new Date().toISOString().split('T')[0]
      }
    });
  } catch (err) {
    console.error("GET RESERVATIONS ERROR:", err);
    res.status(500).json({ message: "Không lấy được danh sách reservation" });
  }
};

export const createReservation = async (req, res) => {
  try {
    const { name, phone, email, date, time, people, note } = req.body;

    if (!name || !phone || !email || !date || !time || !people) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    // Ghép date + time → reservationTime
    const reservationTime = new Date(`${date}T${time}:00`);

    if (isNaN(reservationTime.getTime())) {
      return res.status(400).json({ message: "Thời gian đặt không hợp lệ" });
    }

    // Không cho đặt trong quá khứ
    if (reservationTime < new Date()) {
      return res.status(400).json({ message: "Không thể đặt giờ trong quá khứ" });
    }

    const reservation = await Reservation.create({
      name,
      phone,
      email,
      date,
      time,
      reservationTime,
      people,
      note,
      status: "PENDING",
    });

    const cancelAt = new Date(reservationTime.getTime() + 30 * 1000);
    const delay = cancelAt.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(async () => {
        const latest = await Reservation.findById(reservation._id);

        if (latest && latest.status === "PENDING") {
          latest.status = "CANCELLED";
          await latest.save();
        }
      }, delay);
    }

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// XÁC NHẬN (PENDING -> COMPLETED)
export const confirmReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({
        message: "Chỉ có thể xác nhận lịch hẹn đang ở trạng thái PENDING",
      });
    }

    reservation.status = "COMPLETED";
    await reservation.save();

    res.json({ message: "Đã xác nhận lịch hẹn", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// HỦY (chỉ khi PENDING)
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    if (reservation.status !== "PENDING") {
      return res.status(400).json({
        message: "Chỉ được hủy lịch hẹn khi đang ở trạng thái PENDING",
      });
    }

    reservation.status = "CANCELLED";
    await reservation.save();

    res.json({ message: "Đã hủy lịch hẹn", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  XÓA (chỉ khi COMPLETED)
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    if (reservation.status === "PENDING") {
      return res.status(400).json({
        message: "Không được xóa lịch hẹn khi đang ở trạng thái chờ",
      });
    }

    await Reservation.findByIdAndDelete(id);

    res.json({ message: "Xóa lịch hẹn thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
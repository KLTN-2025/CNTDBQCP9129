import Reservation from "../../model/reservation.model.js";
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách reservation" });
  }
};
export const createReservation = async (req, res) => {
  try {
    const { name, phone, email, time, people, note } = req.body;

    if (!name || !phone || !email || !time || !people) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
    }

    const reservation = await Reservation.create({
      name,
      phone,
      email,
      time,
      people,
      note,
      status: "PENDING",
    });

    // Auto cancel sau 15 phút nếu chưa xác nhận
    setTimeout(async () => {
      const latest = await Reservation.findById(reservation._id);
      if (latest && latest.status === "PENDING") {
        latest.status = "CANCELLED";
        await latest.save();
        console.log("Auto cancel reservation:", latest._id);
      }
    }, 30 * 1000);

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// XÁC NHẬN (PENDING → COMPLETED)
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

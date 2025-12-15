import Reservation from "../model/reservation.model.js";

export const watchReservations = (io) => {
  try {
    const changeStream = Reservation.watch();

    changeStream.on("change", async (change) => {
      console.log("Reservation thay đổi:", change.operationType);
      const reservationId = change.documentKey?._id;
      const reservation = reservationId
        ? await Reservation.findById(reservationId)
        : null;

      io.to("admin_room").emit("reservation_changed", {
        type: change.operationType, // insert | update | delete
        reservationId,
        data: reservation,          // full document
        updatedFields: change.updateDescription?.updatedFields,
        timestamp: new Date(),
      });
    });

    changeStream.on("error", (error) => {
      console.error("Reservation Change Stream error:", error);
    });

    console.log("Đã bật realtime cho Reservation collection");
  } catch (error) {
    console.error("Không thể bật Change Stream Reservation:", error);
  }
};

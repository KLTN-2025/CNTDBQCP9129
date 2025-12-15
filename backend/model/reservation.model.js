import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: null,
      required: true,
    },

    time: {
      type: String,
      required: true, 
    },

    people: {
      type: Number,
      required: true,
      min: 1,
    },

    note: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;

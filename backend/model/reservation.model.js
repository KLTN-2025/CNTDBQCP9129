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
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    reservationTime: {
      type: Date,
      required: true,
      index: true,
    },

    people: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    note: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;

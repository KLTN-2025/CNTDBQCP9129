import mongoose from "mongoose";

const importReceiptSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    items: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalCost: {
          type: Number,
          required: true,
          min: 0,
        },
        pricePerUnit: {
          // = totalCost / quantity
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    note: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // nếu có quản lý/nhân viên
      default: null,
    },
  },
  { timestamps: true }
);

const ImportReceipt = mongoose.model("ImportReceipt", importReceiptSchema);
export default ImportReceipt;

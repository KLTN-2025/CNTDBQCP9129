import mongoose from "mongoose";

const importReceiptSchema = new mongoose.Schema(
  {
    items: [
      {
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        ingredientName: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        pricePerUnit: {
          type: Number,
          required: true,
          min: 0,
        },
        totalCost: {
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
    type: {
      type: String,
      enum: ["IMPORT", "EXPORT"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const ImportReceipt = mongoose.model("ImportReceipt", importReceiptSchema);
export default ImportReceipt;

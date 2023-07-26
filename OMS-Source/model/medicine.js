/** @format */

const mongoose = require("mongoose");
const MedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    unit: { type: Number, required: true },
    typeMedicineIds: { type: [String], required: true },
    entryPrice: { type: Number, required: true },
    price: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("medicine", MedicineSchema);

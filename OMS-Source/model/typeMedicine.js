/** @format */

const mongoose = require("mongoose");
const TypeMedicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    medicineIds: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("typeMedicine", TypeMedicineSchema);

/** @format */

const mongoose = require("mongoose");
const ConsultationSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    medicineIds: { type: [String] },
    userIds: { type: [String], required: true },

    acitvityIds: { type: [String], required: true },
    description: { type: String },
    status: { type: String, default: "New", enum: ["New", "ReExamination"] },

    total: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("consultation", ConsultationSchema);

/** @format */

const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    consultationIds: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("activity", ActivitySchema);

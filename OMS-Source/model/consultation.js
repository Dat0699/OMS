/** @format */

const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    medicines: { type: [{
      name:  { type: String },
      amount: { type: Number },
      unit: {type: String},
      period: {type: String},
      descMedicine: {type: String}
    }] },
    description: { type: String },
    userId: { type: String, required: true },
    userId2: { type: String },
    generalHealth: {
      bloodPressure:  { type: Number },
      sugarLevel:     { type: Number },
      heartRate:      { type: Number },
      temperature:    { type: Number },
      weight:         { type: Number },
      height:         { type: Number },
    },
    attachment: {type: [String]},
    status: { type: Number, default: 1, enum: [1, 2] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("consultation", ConsultationSchema);

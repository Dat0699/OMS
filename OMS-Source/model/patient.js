/** @format */

const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number },
    address: { type: String,  },
    email: { type: String,  },
    password: { type: String,  },
    phoneNumber: { type: String,  },
    consultationIds: { type: [String] },
    userId: { type: String },
    facultyRef: { type: String, default: "ALL", enum: ["TMH", "M", "PS", "RHM", "ALL"] },
    status: { type: String, default: "NEW", enum: ["NEW", "RE-EXAM"] },
    birthDate: { type: String },
    diagnose: { type: String },
    attachment:  { type: [String] },
    gender: { type: String, default: "MALE", enum: ["MALE", "FEMALE", "OTHERS"] },

    preCheckHealth : {
        bloodPressure:  { type: Number },
        sugarLevel:     { type: Number },
        heartRate:      { type: Number },
        temperature:    { type: Number },
        weight:         { type: Number },
        height:         { type: Number },
        lastestUpdated  : { type: String },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("activity", ActivitySchema);

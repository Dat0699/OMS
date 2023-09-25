/** @format */

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Date, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "BS", enum: ["TN", "BS", "BSXN", "TK"] },
    email: { type: String },
    isAdmin: { type: Boolean, default: false, },
    faculty: { type: String, default: "ALL", enum: ["TMH", "M", "PS", "RHM", "ALL"] },
    avatar: {type: String },
    gender: { type: String, default: "MALE", enum: ["MALE", "FEMALE", "OTHERS"] },
    setting: {
        pageLength: {type: Number}  
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

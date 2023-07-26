/** @format */

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
    // role        : {type :String, required:true},
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

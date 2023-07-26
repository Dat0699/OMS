/** @format */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT_SERVER = 5000;
const Redis = require("redis");
const client = Redis.createClient();
client.exists;
client.connect();
global.cached = client;

const mongoose = require("mongoose");
const userRoute = require("./route/user");
const medicineRoute = require("./route/medicine");
const roleRoute = require("./route/role");
const activityRoute = require("./route/activity");
const consultationRoute = require("./route/consultation");
const patientRoute = require("./route/patient");

// const PORT_SOCKET = 5500;

dotenv.config();

mongoose
  .connect(process.env.APP_DATABASE_URL)
  .then(() => console.log("DB connection successful"))
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT_SERVER, async () => {
  console.log(`Example app listening on port ${PORT_SERVER}`);
});

app.get("/", (req, res) => {
  res.send("Welcome guy go to api hehe !");
});

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/medicines", medicineRoute);
// app.use("/api/role", roleRoute);
// app.use("/api/activity", activityRoute);
// app.use("/api/consultation", consultationRoute);
// app.use("/api/patient", patientRoute);

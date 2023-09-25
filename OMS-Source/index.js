/** @format */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT_SERVER = 5702;
const Redis = require("redis");
const client = Redis.createClient();
const fileUpload = require('express-fileupload');
var cors = require('cors')

app.use(cors())
// client.exists;
// client.set(1,1,1)
client.connect();
global.cached = client;

const mongoose = require("mongoose");
const userRoute = require("./route/user");
const medicineRoute = require("./route/medicine");
const consultationRoute = require("./route/consultation");
const patientRoute = require("./route/patient");
const fileRoute = require("./route/file");


const { getLog, checkHeaderConfig, getUser } = require("./middleware");

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

app.use(fileUpload());
app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/medicines", checkHeaderConfig, getUser, getLog,  medicineRoute);
app.use("/api/patient", checkHeaderConfig, getUser, getLog,  patientRoute);
app.use("/api/patientAuth", patientRoute);
app.use("/api/consultation", checkHeaderConfig, getUser, getLog,  consultationRoute);

app.use("/api/file", fileRoute);







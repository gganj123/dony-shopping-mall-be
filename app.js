const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");
const app = express();

require("dotenv").config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost",
      "https://dony-shop.netlify.app",
    ], // Netlify 배포 주소
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", indexRouter);
// api/user
const mongoURI = process.env.LOCAL_DB_ADDRESS;
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;
mongoose
  .connect(MONGODB_URI_PROD || mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail, err"));

app.listen(process.env.PORT || 5000, () => {
  console.log("server on");
});

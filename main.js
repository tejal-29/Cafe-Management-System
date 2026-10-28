
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(
  session({
    secret: process.env.SESSION_SECRET || "My secretKey",
    saveUninitialized: true,
    resave: false,
  })
);


app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});


app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads"));


app.set("view engine", "ejs");


app.use("/", require("./routes/routes"));


mongoose
  .connect(process.env.DB_URI, {
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

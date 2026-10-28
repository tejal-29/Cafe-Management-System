
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://foodieserendipity.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
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

async function startServer() {
  try {
    if (!process.env.DB_URI) {
      throw new Error("DB_URI is missing from the .env file");
    }

    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET is missing from the .env file");
    }

    await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();

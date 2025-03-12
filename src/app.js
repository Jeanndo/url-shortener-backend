const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const globalErrorHandler = require("./errorController/errorController");
require("dotenv").config();

const userRouter = require("./users/routes/users.routes");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "WELCOME TO URL SHORTENER API(s)",
  });
});

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser"); 

const globalErrorHandler = require("./errorController/errorController");
require("dotenv").config();

const userRouter = require("./users/routes/users.routes");
const urlRouter = require("./urls/routes/urls.routes");
const AppError = require("./utils/appError");
const { csrfMiddleware } = require("./middlewares");

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type","X-CSRF-Token","Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json({ limit: "5mb" }));

app.use(morgan("dev"));

app.get("/api/v1/csrf", csrfMiddleware, (req, res) => {

  const csrfToken = req.csrfToken();
  res.cookie("_csrf", csrfToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" }); 
  res.json({ csrfToken: csrfToken });

});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "WELCOME TO URL SHORTENER API(s)",
  });
});


app.use("/api/v1/users", userRouter);
app.use("/api/v1/urls",urlRouter)

app.all("*", (req, res, next) => {
  next(new AppError(`Cant't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

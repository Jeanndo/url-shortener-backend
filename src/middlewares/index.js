const { User } = require("./../../models");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const csrf = require("csurf");


require("dotenv").config();

const checkAuth = catchAsync(async (req, res, next) => {
    
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next(new AppError("Unauthorized Access", 401));

  const token = authHeader.split(" ")[1];

  if (!token || token === undefined) {
    return next(new AppError("Unauthorized Access", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRETE);

  if (!decoded.id) {
    return next(new AppError("Unauthorized Access", 401));
  }

  const freshUser = await User.findOne({
    where: {
      id: decoded.id,
    },
  });

  if (!freshUser) {
    return next(new AppError("Unauthorized Access", 401));
  }

  req.user = freshUser;

  next();
});

const joiValidator = (schema) => catchAsync(async (req, res, next) => {

    const { body, query, params } = req;

    const { error } = schema.validate({ ...body, ...query, ...params });

    if (error) {

      const {details: [detail = null]} = error;

      let { message } = detail;

      return res.status(400).send({
        status: 400,
        message: "Input validation failed!",
        error: message,
      });

    }

    next();
  });


  const csrfMiddleware = csrf({
    cookie: {
       key: "_csrf",
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    },
  });


  const checkCsrfToken = catchAsync(async(req, res, next)=>{

    const csrfTokenFromCookie = req.cookies["_csrf"];

    const csrfTokenFromHeader = req.headers['x-csrf-token'];

    if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
      return res.status(403).json({ error: 'Missing CSRF token in cookie or header' });
    }

    if(csrfTokenFromCookie!==csrfTokenFromHeader){
      return next(new AppError("Invalid CSRF token"))
    }

    next()

  })


module.exports = { checkAuth, joiValidator,checkCsrfToken,csrfMiddleware};

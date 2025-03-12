const { User } = require("../../../models");
const { hashPassword, comparePassword } = require("./../../utils/auth");
const jwt = require("jsonwebtoken");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { paginate } = require("../../utils/paginate");
const { sendResponse } = require("../../utils/response");

require("dotenv").config();

function generateAccessToken(data) {
  return jwt.sign(data, process.env.JWT_SECRETE, {
    expiresIn: process.env.EXPIRES_IN,
  });
}

const signUp = catchAsync(async ({ body }, res, next) => {
  const user = await User.findOne({
    where: {
      email: body.email,
    },
  });

  if (user) {
    return next(new AppError("You already have account", 400));
  }

  const createdUser = await User.create({
    ...body,
    password: await hashPassword(body.password),
  });

  const { password, ...createdUserWithNoPassword } = createdUser.dataValues;

  return sendResponse(res, 201, "Account created", createdUserWithNoPassword);
});


const login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({
    where: {
      phoneNumber,
      deletedAt: null,
    },
  });

  if (!user) {
    return next(new AppError("Invalid Credentials", 403));
  }

  const isPasswordMatching = await comparePassword(password, user?.password);

  if (!isPasswordMatching) {
    return next(new AppError("Invalid Credentials", 403));
  }

  const accessToken = generateAccessToken({
    id: user.id,
  });

  return sendResponse(res, 200, "Logged in Successful", {
    token: accessToken,
  });
});



const getAllUsers = catchAsync(async ({ query: { limit = 10, page = 1 } }, res, next) => {
    
    const where = {
      deletedAt: null,
    };

    const pagination = paginate(page, limit);

    let users = await User.findAndCountAll({
      where: { ...where },
      limit: pagination.limit,
      offset: pagination.offset,
      attributes: { exclude: ["password"] },
    });

    page = Number(page);
    users = { ...users, page };

    return sendResponse(res, 200, "User(s) retrieved", users);
  }
);

const getUser = catchAsync(async ({ user: { id } }, res, next) => {

  const user = await User.findOne({
    where: {
      id: id,
      deletedAt: null,
    },
    attributes: { exclude: ["password", "deletedAt"] },
  });

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  return sendResponse(res, 200, "User retrieved", user);

});



const updateUser = catchAsync(async ({ params: { id }, body }, res, next) => {

  const user = await User.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  const updatedUser = await User.update(body, {
    where: {
      id,
    },
    returning: true,
    plain: true,
  });

  const { password, ...updatedUserWithNoPassword } = updatedUser[1].dataValues;

  return sendResponse(res, 200, "Profile Updated", updatedUserWithNoPassword);


});

const deleteUser = catchAsync(async ({ params: { id } }, res, next) => {

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  await User.update(
    { deletedAt: new Date() },
    {
      where: {
        id,
      },
    }
  );

  return sendResponse(res, 200, "User Deleted");

  
});

module.exports = {
  signUp,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};

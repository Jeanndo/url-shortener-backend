const { Url, User } = require("../../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { paginate } = require("../../utils/paginate");
const { sendResponse } = require("../../utils/response");
const { v4: uuidv4 } = require('uuid');

const { response } = require("express");

require("dotenv").config();

const generateShortCode = () => {
  return uuidv4().slice(0, 6);
};

const addUrl = catchAsync(async ({ user: { id }, body }, res, next) => {

  const shortCode = generateShortCode();

  const newShortCode = await Url.create({
    user_id: id,
    short_code: shortCode,
    long_url: body.long_url,
  });

  return sendResponse(
    res,
    201,
    "short code generated successfully!🚀",
    newShortCode
  );
});

const getUrl = catchAsync(
  async ({ user: { id }, params: { shortUrl } }, res, next) => {
    const shortCode = await Url.findOne({
      where: {
        user_id: id,
        short_code: shortUrl,
        deletedAt: null,
      },
    });

    if (!shortCode) {
      return next(new AppError("short url not found", 404));
    }

    return response(res, 200, "Retrieved!", shortCode);
  }
);

const getAllUrls = catchAsync(
  async ({ user: { id }, query: { limit = 10, page = 1 } }, res, next) => {
    const pagination = paginate(page, limit);

    const user = await User.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      return next(new AppError("Access Denied!", 400));
    }

    const urls = await Url.findAndCountAll({
      where: {
        user_id: id,
        deletedAt: null,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    page = Number(page);

    urls = { ...urls, page };

    return response(res, 200, "Urls Retrieved", urls);
  }
);

const updateUrl = catchAsync(
  async ({ user: { id }, params: { code } }, res, next) => {
    const user = await User.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      return next(new AppError("Access Denied!", 400));
    }

    const oldShortCode = await Url.findOne({
      where: {
        user_id: id,
        short_code: code,
        deletedAt: null,
      },
    });

    if (!oldShortCode) {
      return next(new AppError("Must provide old short url", 400));
    }

    await Url.update(
      {
        short_code: generateShortCode(),
      },
      {
        where: {
          user_id: id,
          short_code: code,
          deletedAt: null,
        },
      }
    );

    return response(res, 200, "short url uppdated");
  }
);

const deleteUrl = catchAsync(
  async ({ user: { id }, params: { code } }, res, next) => {
    const user = await User.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      return next(new AppError("Access Denied!", 400));
    }

    const shortCode = await Url.findOne({
      where: {
        user_id: id,
        short_code: code,
        deletedAt: null,
      },
    });

    if (!shortCode) {
      return next(new AppError("short url not found", 404));
    }

    // apply soft delete

    await Url.update(
      {
        deletedAt: Date.now(),
      },
      {
        where: {
          user_id: id,
          short_code: code,
        },
      }
    );

    return response(res, 200, "short url deleted successfully!");
  }
);

const redirectToOriginalUrl = catchAsync(
  async ({ params: { code } }, res, next) => {
    
    const shortCode = await Url.findOne({
      where: {
        short_code: code,
        deletedAt: null,
      },
    });

    if (!shortCode) {
      return next(new AppError("short url not found", 404));
    }

    res.redirect(shortCode.long_url);

    return response(res, 200, "Redirected successfully!", shortCode);
  }
);

module.exports = {
  addUrl,
  getUrl,
  getAllUrls,
  updateUrl,
  deleteUrl,
  redirectToOriginalUrl,
};

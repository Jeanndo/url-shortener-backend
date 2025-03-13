const { Url, User,Analytics } = require("../../../models");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { paginate } = require("../../utils/paginate");
const { sendResponse } = require("../../utils/response");
const { v4: uuidv4 } = require('uuid');
const UAParser = require("ua-parser-js");
const { isValidURL } = require("../../utils/urlValidator");


require("dotenv").config();

const generateShortCode = () => {
  return uuidv4().slice(0, 7).toLocaleUpperCase()
};

const shortenUrl = catchAsync(async ({ user: { id }, body }, res, next) => {

  if(!isValidURL(body.long_url)){
      return next(new AppError("Invalid url",400))
  }

  const shortCode = generateShortCode();

  const newShortCode = await Url.create({
    user_id: id,
    short_code: shortCode,
    long_url: body.long_url,
    title:body.title
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
      include:[
        {
          model:Analytics,
          as:'stats'
        }
      ],
      where: {
        user_id: id,
        short_code: shortUrl,
        deletedAt: null,
      },
    });

    if (!shortCode) {
      return next(new AppError("short url not found", 404));
    }

    return sendResponse(res, 200, "Retrieved!", shortCode);
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

    let urls = await Url.findAndCountAll({
      where: {
        user_id: id,
        deletedAt: null,
      },
      limit: pagination.limit,
      offset: pagination.offset,
    });

    page = Number(page);

    urls = { ...urls, page };

    return sendResponse(res, 200, "Urls Retrieved", urls);
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

    return sendResponse(res, 200, "short url uppdated");
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

    return sendResponse(res, 200, "short url deleted successfully!");
  }
);

const redirectToOriginalUrl = catchAsync(
  async ({ params: { code },headers }, res, next) => {
    
    const shortCode = await Url.findOne({
      where: {
        short_code: code,
        deletedAt: null,
      },
    });

    if (!shortCode) {
      return next(new AppError("short url not found", 404));
    }

    await shortCode.increment("clicks",{by:1})

    const parser = new UAParser(headers["user-agent"]);
    const deviceType = parser.getDevice().type || "desktop";

    await Analytics.create({
      urlId:shortCode.id,
      deviceType:deviceType
    })

    res.redirect(shortCode.long_url);
  }
);

module.exports = {
  shortenUrl,
  getUrl,
  getAllUrls,
  updateUrl,
  deleteUrl,
  redirectToOriginalUrl,
};



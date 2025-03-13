const express = require("express");

const {
  shortenUrl,
  getUrl,
  getAllUrls,
  // updateUrl,
  // deleteUrl,
  // redirectToOriginalUrl,
} = require("./../controllers/urls.controllers");

const { checkAuth } = require("../../middlewares");

const router = express.Router();

router.post("/shorten",checkAuth,shortenUrl)

router.get("/",checkAuth, getAllUrls);
router.get("/analytics/:shortUrl",getUrl)
// router
//   .route("/:code")
//   .get(checkAuth, getUrl)
//   .patch(checkAuth, updateUrl)
//   .delete(checkAuth, deleteUrl);

// router.get("/redirect/:code", redirectToOriginalUrl);

module.exports = router;

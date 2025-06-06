const express = require("express");

const {
  shortenUrl,
  getUrl,
  getAllUrls,
  updateUrl,
  deleteUrl,
  redirectToOriginalUrl,
} = require("./../controllers/urls.controllers");

const { checkAuth,checkCsrfToken } = require("../../middlewares");

const router = express.Router();

router.post("/shorten",checkAuth,checkCsrfToken,shortenUrl)

router.get("/",checkAuth,checkCsrfToken, getAllUrls);
router.get("/analytics/:shortUrl",checkAuth,checkCsrfToken,getUrl)
router
.route("/:code")
.get(redirectToOriginalUrl)
.patch(checkAuth, updateUrl)
.delete(checkAuth, deleteUrl);


module.exports = router;

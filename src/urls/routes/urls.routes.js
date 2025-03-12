const express = require("express");

const {
  addUrl,
  getUrl,
  getAllUrls,
  updateUrl,
  deleteUrl,
  redirectToOriginalUrl,
} = require("./../controllers/urls.controllers");

const { checkAuth } = require("../../middlewares");

const router = express.Router();

router.route("/").get(checkAuth, getAllUrls).post(addUrl);

router
  .route("/:code")
  .get(checkAuth, getUrl)
  .patch(checkAuth, updateUrl)
  .delete(checkAuth, deleteUrl);

router.get("/redirect/:code", redirectToOriginalUrl);

module.exports = router;

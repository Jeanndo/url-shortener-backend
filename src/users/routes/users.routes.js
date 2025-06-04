const express = require("express");

const {
  login,
  signUp,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  logout,
  refreshUserToken
} = require("./../controllers/users.controllers");
const { checkAuth } = require("../../middlewares");

const router = express.Router();

router.post("/auth/register", signUp);
router.post("/auth/login", login);
router.post("/auth/logout",logout);
router.get("/auth/refresh-token",refreshUserToken)

router.route("/").get(checkAuth, getAllUsers);

router
  .route("/:id")
  .get(checkAuth, getUser)
  .patch(checkAuth, updateUser)
  .delete(checkAuth, deleteUser);

module.exports = router;

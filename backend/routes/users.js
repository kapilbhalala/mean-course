const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.userSignUp);
router.post("/signin", userController.userLogin);

module.exports = router;

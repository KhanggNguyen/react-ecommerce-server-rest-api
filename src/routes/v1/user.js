const express = require("express");
const router = express.Router();

const { getUserById } = require('../controller/v1/user');

router.post("/user/getUserbyId", requireSignin, getUserById);
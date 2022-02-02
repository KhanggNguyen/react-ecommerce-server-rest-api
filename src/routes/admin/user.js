const express = require('express');
const { getUsers, updateUser } = require('../../controller/admin/user');
const router = express.Router();

const { requireSignin, adminMiddleware } = require('../../middleware');

router.post("/admin/users", requireSignin, adminMiddleware, getUsers);

router.post("/admin/user/update", requireSignin, adminMiddleware, updateUser)

module.exports = router;
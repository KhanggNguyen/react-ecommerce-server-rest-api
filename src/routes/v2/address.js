const express = require('express');
const { requireSignin, userMiddleware } = require('../../middleware');
const { addAddress, getAddress } = require('../controller/v2/address');
const router = express.Router();


router.post('/user/address/create', requireSignin, userMiddleware, addAddress);
router.post('/user/address/', requireSignin, userMiddleware, getAddress);

module.exports = router;
const express = require('express');
const { signup, signin, signout } = require('../../controller/v1/admin/auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest } = require('../../middleware/authValidator');
const { requireSignin } = require('../../middleware');
const router = express.Router();


router.post('/admin/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', requireSignin, signout)


module.exports = router;
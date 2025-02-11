const router = require('express').Router();
const { register, login, logout, updateProfile } = require('../controller/userController');
const { authCheck } = require('../middleware/authCheck');
const { upload } = require('../middleware/multer');







router.route('/reg').post(upload.none(), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/update-profile').put(authCheck, upload.any([{ name: 'profile', maxCount: 1 }]), updateProfile);


















module.exports = router;

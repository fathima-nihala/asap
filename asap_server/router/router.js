const router = require('express').Router();
const { updateBasicInfo, getBasicInfo } = require('../controller/basicInfoController');
const { updateCareerObjective, getCareerObjective } = require('../controller/careerController');
const { educationAdd, educationEdit, educationDelete, getEducationByUser } = require('../controller/educationController');
const { addSkill, getSkills, updateSkills, removeSkill } = require('../controller/skillController');
const { register, login, logout, updateProfile } = require('../controller/userController');
const { authCheck } = require('../middleware/authCheck');
const { upload } = require('../middleware/multer');



//user
router.route('/reg').post(upload.none(), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/update-profile').put(authCheck, upload.single('profile'), updateProfile);

//education
router.route('/edu').post(authCheck,educationAdd);
router.route('/edu/:id').put(authCheck,educationEdit).delete(authCheck,educationDelete);
router.route('/edu').get(authCheck,getEducationByUser);

//basic info
router.route('/basic-info').put(authCheck, updateBasicInfo);
router.route('/basic-info').get(authCheck, getBasicInfo);

//career
router.route('/career').put(authCheck, updateCareerObjective);
router.route('/career').get(authCheck, getCareerObjective);

//skills
router.route('/skill').post(authCheck,addSkill);
router.route('/skill').get(authCheck,getSkills);
router.route('/skill').put(authCheck,updateSkills);
router.route('/skill/:id').delete(authCheck,removeSkill);
























module.exports = router;

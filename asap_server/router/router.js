const router = require('express').Router();
const { updateBasicInfo, getBasicInfo } = require('../controller/basicInfoController');
const { updateCareerObjective, getCareerObjective } = require('../controller/careerController');
const { educationAdd, educationEdit, educationDelete, getEducationByUser } = require('../controller/educationController');
const { getPortfolio, updatePortfolio } = require('../controller/protfolioController');
const { uploadResume, updateResume, uploadVideoResume, downloadResume, getUserResumes, deleteDocumentResume, deleteVideoResume } = require('../controller/resumeController');
const { addSkill, getSkills, updateSkills, removeSkill } = require('../controller/skillController');
const { register, login, logout, updateProfile, getUserProfile } = require('../controller/userController');
const { addWorkExperience, editWorkExperience } = require('../controller/workExpController');
const { authCheck } = require('../middleware/authCheck');
const { upload, resumeUpload, handleMulterErrors, videoUpload } = require('../middleware/multer');

//user
router.route('/reg').post(upload.none(), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/update-profile').put(authCheck,upload.single('profile'), updateProfile);
router.route('/me').get(getUserProfile);


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

//resume & videos
router.route('/document').post(authCheck,resumeUpload.single('resume'),handleMulterErrors,uploadResume);
router.route('/document/:id').put(authCheck,resumeUpload.single('resume'),handleMulterErrors,updateResume).delete(authCheck,deleteDocumentResume);

router.route('/video').post(authCheck,videoUpload.single('video'),handleMulterErrors,uploadVideoResume);
router.route('/resumes/:id').delete(authCheck,deleteVideoResume);

router.route('/resumes').get(authCheck, getUserResumes);
router.route('/download/:type/:id').get(authCheck, downloadResume);

//protfolio
router.route('/portfolio')
    .get(authCheck, getPortfolio)
    .put(authCheck, updatePortfolio);


//work experience
router.route('/work').post(authCheck, addWorkExperience);
router.route('/work/:id').put(authCheck, editWorkExperience);




























module.exports = router;

const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const hospitalController = require('../../controllers/hospital.controller')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.cheifDoctorRegister), hospitalController.createHospital);
router.post('/login', validate(authValidation.login), hospitalController.login);



module.exports = router;
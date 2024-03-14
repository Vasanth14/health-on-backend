const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const cheifDoctorValidation = require('../../validations/cheifDoctor.validation')
const authController = require('../../controllers/auth.controller');
const cheifDoctorController = require('../../controllers/cheifDoctor.controller')
const doctorController = require('../../controllers/doctor.controller')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', auth('createDoctors'), validate(authValidation.doctorRegister), doctorController.createDoctor);
router.post('/login', validate(authValidation.login), doctorController.login);


module.exports = router;
const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const cheifDoctorValidation = require('../../validations/cheifDoctor.validation')
const authController = require('../../controllers/auth.controller');
const cheifDoctorController = require('../../controllers/cheifDoctor.controller')
const auth = require('../../middlewares/auth');

const router = express.Router();


router.post('/register', auth('createCheifDoctor'), validate(authValidation.cheifDoctorRegister), cheifDoctorController.createCheifDoctor);
router.post('/login', validate(authValidation.login), cheifDoctorController.login);

router
  .route('/:cheifDoctorId')
  .get(auth('getCheifDoctors'), validate(cheifDoctorValidation.getCheifDoctor), cheifDoctorController.getCheifDoctor)
  .patch(auth('manageCheifDoctors'), cheifDoctorController.updateCheifDoctor) //need to add validations for updateBody later on

module.exports = router;
const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const cheifDoctorValidation = require('../../validations/cheifDoctor.validation')
const hospitalController = require('../../controllers/hospital.controller')
const doctorController = require('../../controllers/doctor.controller')
const cheifDoctorController = require('../../controllers/cheifDoctor.controller')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.hospRegister), hospitalController.createHospital);
router.post('/login', validate(authValidation.login), hospitalController.login);


router.get('/cheifDoctors/:hospitalId', (auth('getCheifDoctors'), cheifDoctorController.getHospitalCheifDoctors)) //get all the cheif doctors from the reuqesting hospital
router.get('/doctors/:hospitalId', (auth('getDoctors'), doctorController.getHospitalDoctors)) //get all the doctors from the reuqesting hospital



router
  .route('/cheifDoctor/:cheifDoctorId')
  .get(auth('getCheifDoctors'), validate(cheifDoctorValidation.getCheifDoctor), cheifDoctorController.getCheifDoctor)
  .patch(auth('manageCheifDoctors'), cheifDoctorController.updateCheifDoctor) //need to add validations for updateBody later on
  .delete(auth('manageCheifDoctors'), validate(cheifDoctorValidation.deleteCheifDoctor), cheifDoctorController.deleteCheifDoctor);

module.exports = router;
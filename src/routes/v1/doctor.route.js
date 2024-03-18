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


router
  .route('/doctor/:doctorId')
  .get(auth('getDoctors'), doctorController.getDoctor)
  .patch(auth('manageDoctors'), doctorController.updateDoctor) //need to add validations for updateBody later on
  .delete(auth('manageDoctors'), doctorController.deleteDoctor);

module.exports = router;
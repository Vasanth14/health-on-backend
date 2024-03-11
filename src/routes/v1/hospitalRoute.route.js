const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const hospitalController = require('../../controllers/hospital.controller')
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.hospRegister), hospitalController.createHospital);
router.post('/login', validate(authValidation.login), hospitalController.login);



module.exports = router;
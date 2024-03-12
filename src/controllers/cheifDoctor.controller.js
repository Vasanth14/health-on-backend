const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const {hospitalService, authService, userService, tokenService, emailService, cheifDoctorService} = require('../services')


const createCheifDoctor = catchAsync(async (req, res) => {
    const cheifDoctor = await cheifDoctorService.createCheifDoctor(req.body, req.hospital._id);
    const tokens = await tokenService.generateAuthTokens(cheifDoctor);
    res.status(httpStatus.CREATED).send({ cheifDoctor, tokens });
  });

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const cheifDoctor = await cheifDoctorService.loginCheifDoctorWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(cheifDoctor);
    res.send({ cheifDoctor, tokens });
  });



  module.exports = {
    createCheifDoctor,
    login,
  };
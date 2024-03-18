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

const getHospitalCheifDoctors = catchAsync(async (req, res) => {
    const filter = {'hospital.hospitalId' : req.params.hospitalId}
    console.log(filter)
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await cheifDoctorService.queryHospitalCheifDoctors(filter, options);
    res.send(result);
});


const getCheifDoctors = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await cheifDoctorService.queryCheifDoctors(filter, options);
    res.send(result);
  });

const getCheifDoctor = catchAsync(async (req, res) => {
    const cheifDoctor = await cheifDoctorService.getCheifDoctorById(req.params.cheifDoctorId);
    if (!cheifDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'cheifDoctor not found');
    }
    res.send(cheifDoctor);
  });

const updateCheifDoctor = catchAsync(async (req, res) => {
    const cheifDoctor = await cheifDoctorService.updateCheifDoctorById(req.params.cheifDoctorId, req.body);
    res.send(cheifDoctor);
  });
  

const deleteCheifDoctor = catchAsync(async (req, res) => {
    await cheifDoctorService.deleteCheifDoctorById(req.params.cheifDoctorId);
    res.status(httpStatus.NO_CONTENT).send();
  });
  

  module.exports = {
    createCheifDoctor,
    login,
    getHospitalCheifDoctors,
    getCheifDoctors,
    getCheifDoctor,
    updateCheifDoctor,
    deleteCheifDoctor
  };
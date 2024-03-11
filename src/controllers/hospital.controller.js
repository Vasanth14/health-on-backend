const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const {hospitalService, authService, userService, tokenService, emailService} = require('../services')

const createHospital = catchAsync(async (req, res) => {
    const hospital = await hospitalService.createHospital(req.body);
    const tokens = await tokenService.generateAuthTokens(hospital);
    res.status(httpStatus.CREATED).send({ hospital, tokens });
  });

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const hospital = await hospitalService.loginHospitalWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(hospital);
    res.send({ hospital, tokens });
  });

const getHospitals = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await hospitalService.queryHospitals(filter, options);
    res.send(result);
  });

const getHospital = catchAsync(async (req, res) => {
    const hospital = await hospitalService.getHospitalById(req.params.hospitalId);
    if (!hospital) {
      throw new ApiError(httpStatus.NOT_FOUND, 'hospital not found');
    }
    res.send(hospital);
  });

module.exports = {
    createHospital,
    getHospitals,
    getHospital,
    login,
  };
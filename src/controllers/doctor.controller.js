const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const {hospitalService, authService, userService, tokenService, emailService, cheifDoctorService, doctorService} = require('../services')



const createDoctor = catchAsync(async (req, res) => {
    const doctor = await doctorService.createDoctor(req.body, req.hospital._id);
    const tokens = await tokenService.generateAuthTokens(doctor);
    res.status(httpStatus.CREATED).send({ doctor, tokens });
  });

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const doctor = await doctorService.loginDoctorWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(doctor);
    res.send({ doctor, tokens });
  });

const getDoctors = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await doctorService.queryDoctors(filter, options);
    res.send(result);
});


const getHospitalDoctors = catchAsync(async (req, res) => {
  const filter = {'hospital.hospitalId' : req.params.hospitalId}
  console.log(filter)
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await doctorService.queryHospitalDoctors(filter, options);
  res.send(result);
});


const getDoctor = catchAsync(async (req, res) => {
    const doctor = await doctorService.getDoctorById(req.params.doctorId);
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'doctor not found');
    }
    res.send(doctor);
  });

const updateDoctor = catchAsync(async (req, res) => {
    const doctor = await doctorService.updateDoctorById(req.params.doctorId, req.body);
    res.send(doctor);
  });
  

const deleteDoctor = catchAsync(async (req, res) => {
    await doctorService.deleteDoctorById(req.params.doctorId);
    res.status(httpStatus.NO_CONTENT).send();
  });


module.exports = {
    createDoctor,
    login,
    getDoctor,
    getDoctors,
    getHospitalDoctors,
    updateDoctor,
    deleteDoctor,
  };
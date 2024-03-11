const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
  }),
};

const hospRegister = {
  body: Joi.object().keys({
    hospitalName: Joi.string(),
    hospitalEmail: Joi.string().email(),
    cheifDoctorName: Joi.string(),
    cheifDoctorEmail: Joi.string().email(),
    password: Joi.string().custom(password),
    hospitalLocation: Joi.string(),
    hospitalRegId: Joi.string().alphanum().min(5).max(10),
    hospitalType: Joi.string(),
    hospitalContact: Joi.string(),
    hospitalLogo: Joi.string(),
  }),
};

const cheifDoctorRegister = {
  body: Joi.object().keys({
    cheifDoctorName: Joi.string().required(),
    cheifDoctoremail: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    specialization: Joi.string().required(),
    medicalLicenseNumber: Joi.string().required(),
    yearsOfExperience: Joi.number().integer().min(0).required(),
    educationQualifications: Joi.string().required(),
    profilePicture: Joi.string().uri()
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  hospRegister,
  cheifDoctorRegister,
};

const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const hospitalService = require('./hospital.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const Hospital = require('../models/hospital.model');

/**
 * Generate token
 * @param {ObjectId} hospitalId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (hospitalId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: hospitalId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} hospitalId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, hospitalId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    hospital: hospitalId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, hospital: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {Hospital} hospital
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (hospital) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(hospital.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(hospital.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, hospital.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} hospitalEmail
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (hospitalEmail) => {
  const hospital = await hospitalService.getHospitalByEmail(hospitalEmail);
  if (!hospital) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No hospitals found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(hospital.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, hospital.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {Hospital} hospital
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (hospital) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(hospital.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, hospital.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};

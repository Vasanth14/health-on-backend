const httpStatus = require('http-status');
const { Hospital } = require('../models');
const ApiError = require('../utils/ApiError');
// const Hospital = require('../models/hospital.model');

/**
 * Create a hospital
 * @param {Object} hospitalBody
 * @returns {Promise<Hospital>}
 */
const createHospital = async (hospitalBody) => {
    if (await Hospital.isEmailTaken(hospitalBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return Hospital.create(hospitalBody);
  };


 /**
 * Query for hospitals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHospitals = async (filter, options) => {
    const hospitals = await Hospital.paginate(filter, options);
    return hospitals;
  };

/**
 * Get hospital by id
 * @param {ObjectId} id
 * @returns {Promise<Hospital>}
 */
const getHospitalById = async (id) => {
    return Hospital.findById(id);
  };


/**
 * Get hospital by email
 * @param {string} hospitalEmail
 * @returns {Promise<User>}
 */
const getHospitalByEmail = async (hospitalEmail) => {
  return Hospital.findOne({ hospitalEmail });
};


/**
 * Login with username and password
 * @param {string} hospitalEmail
 * @param {string} password
 * @returns {Promise<Hospital>}
 */
const loginHospitalWithEmailAndPassword = async (hospitalEmail, password) => {
  const hospital = await getHospitalByEmail(hospitalEmail);
  if (!hospital || !(await hospital.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return hospital;
};  

  module.exports = {
    createHospital,
    queryHospitals,
    getHospitalById,
    getHospitalByEmail,
    loginHospitalWithEmailAndPassword,
  };
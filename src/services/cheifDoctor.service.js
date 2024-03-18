const httpStatus = require('http-status');
const { CheifDoctor } = require('../models')
const { Hospital } = require('../models')
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


/**
 * Create a cheifDoctor
 * @param {Object} cheifDoctorBody
 * @param {string} hospitalId
 * @returns {Promise<CheifDoctor>}
 */
const createCheifDoctor = async (cheifDoctorBody, hospitalId) => {
    if (!hospitalId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Hospital should be logged in for creating a chief doctor credentials');
    }

    try {
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hospital not found');
        }

        if (await CheifDoctor.isEmailTaken(cheifDoctorBody.cheifDoctorEmail)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }

        const cheifDoctor = new CheifDoctor({
            ...cheifDoctorBody,
            hospital: {
                hospitalId: hospital._id,
                hospitalName: hospital.hospitalName,
                hospitalEmailAddress: hospital.hospitalEmail,
                hospitalLocation: hospital.hospitalLocation,
                hospitalRegId: hospital.hospitalRegId,
                hospitalType: hospital.hospitalType,
                hospitalContact: hospital.hospitalContact,
                hospitalLogo: hospital.hospitalLogo,
                role: hospital.role,
                isEmailVerified: hospital.isEmailVerified
            }
        });

        return cheifDoctor.save();
    } catch (error) {
        throw new Error(`Failed to create chief doctor: ${error.message}`);
    }
};


/**
* Query for Hospital's CheifDoctors
* @param {Object} filter - Mongo filter
* @param {Object} options - Query options
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/
const queryHospitalCheifDoctors = async (filter, options) => {
    const cheifDoctor = await CheifDoctor.paginate({ ...filter, hospitalId: filter.hospitalId }, options);
    return cheifDoctor;
};



/**
* Query for cheifDoctors
* @param {Object} filter - Mongo filter
* @param {Object} options - Query options
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/
const queryCheifDoctors = async (filter, options) => {
    const cheifDoctor = await CheifDoctor.paginate(filter, options);
    return cheifDoctor;
};

/**
 * Get cheifDoctor by id
 * @param {ObjectId} cheifDoctorId
 * @returns {Promise<CheifDoctor>}
 */
const getCheifDoctorById = async (cheifDoctorId) => {
    return CheifDoctor.findById(cheifDoctorId);
};


/**
 * Get cheifDoctor by email
 * @param {string} cheifDoctorEmail
 * @returns {Promise<CheifDoctor>}
 */
const getCheifDoctorByEmail = async (cheifDoctorEmail) => {
    return CheifDoctor.findOne({ cheifDoctorEmail });
};


/**
 * Login with username and password
 * @param {string} cheifDoctorEmail
 * @param {string} password
 * @returns {Promise<CheifDoctor>}
 */
const loginCheifDoctorWithEmailAndPassword = async (cheifDoctorEmail, password) => {
    const cheifDoctor = await getCheifDoctorByEmail(cheifDoctorEmail);
    if (!cheifDoctor || !(await cheifDoctor.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return cheifDoctor;
};

/**
 * Update cheifDoctor by id
 * @param {ObjectId} cheifDoctorId
 * @param {Object} updateBody
 * @returns {Promise<CheifDoctor>}
 */
const updateCheifDoctorById = async (cheifDoctorId, updateBody) => {
    const cheifDoctor = await getCheifDoctorById(cheifDoctorId);
    if (!cheifDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CheifDoctor not found');
    }
    if (updateBody.cheifDoctorEmail && (await CheifDoctor.isEmailTaken(updateBody.cheifDoctorEmail, cheifDoctorId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(cheifDoctor, updateBody);
    await cheifDoctor.save();
    return cheifDoctor;
  };

/**
 * Delete user by id
 * @param {ObjectId} cheifDoctorId
 * @returns {Promise<CheifDoctor>}
 */
const deleteUserById = async (cheifDoctorId) => {
    const cheifDoctor = await getCheifDoctorById(cheifDoctorId);
    if (!cheifDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'CheifDoctor not found');
    }
    await cheifDoctor.remove();
    return cheifDoctor;
  };

module.exports = {
    createCheifDoctor,
    queryCheifDoctors,
    getCheifDoctorById,
    queryHospitalCheifDoctors,
    getCheifDoctorByEmail,
    loginCheifDoctorWithEmailAndPassword,
    updateCheifDoctorById,
    deleteUserById
};
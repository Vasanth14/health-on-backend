const httpStatus = require('http-status');
const { Doctor } = require('../models')
const { Hospital } = require('../models')
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



/**
 * Create a Doctor
 * @param {Object} doctorBody
 * @param {string} hospitalId
 * @returns {Promise<Doctor>}
 */
const createDoctor = async (doctorBody, hospitalId) => {
    if (!hospitalId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Hospital should be logged in for creating doctor credentials');
    }

    try {
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Hospital not found');
        }

        if (await Doctor.isEmailTaken(doctorBody.doctorEmail)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
        }

        const doctor = new Doctor({
            ...doctorBody,
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

        return doctor.save();
    } catch (error) {
        throw new Error(`Failed to create doctor: ${error.message}`);
    }
};


/**
* Query for Doctors
* @param {Object} filter - Mongo filter
* @param {Object} options - Query options
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/
const queryDoctors = async (filter, options) => {
    const doctor = await Doctor.paginate(filter, options);
    return doctor;
};


/**
* Query for Hospital's Doctors
* @param {Object} filter - Mongo filter
* @param {Object} options - Query options
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/
const queryHospitalDoctors = async (filter, options) => {
    const doctor = await Doctor.paginate({ ...filter, hospitalId: filter.hospitalId }, options);
    return doctor;
};

/**
 * Get Doctor by id
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const getDoctorById = async (doctorId) => {
    return Doctor.findById(doctorId);
};


/**
 * Get Doctor by email
 * @param {string} doctorEmail
 * @returns {Promise<Doctor>}
 */
const getDoctorByEmail = async (doctorEmail) => {
    return Doctor.findOne({ doctorEmail });
};


/**
 * Login with username and password
 * @param {string} doctorEmail
 * @param {string} password
 * @returns {Promise<Doctor>}
 */
const loginDoctorWithEmailAndPassword = async (doctorEmail, password) => {
    const doctor = await getDoctorByEmail(doctorEmail);
    if (!doctor || !(await doctor.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return doctor;
};

/**
 * Update doctor by id
 * @param {ObjectId} doctorId
 * @param {Object} updateBody
 * @returns {Promise<Doctor>}
 */
const updateDoctorById = async (doctorId, updateBody) => {
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
    }
    if (updateBody.doctorEmail && (await Doctor.isEmailTaken(updateBody.doctorEmail, doctorId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(doctor, updateBody);
    await doctor.save();
    return doctor;
  };

/**
 * Delete doctor by id
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const deleteDoctorById = async (doctorId) => {
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'doctor not found');
    }
    await doctor.remove();
    return doctor;
  };



module.exports = {
    createDoctor,
    getDoctorByEmail,
    queryDoctors,
    queryHospitalDoctors,
    loginDoctorWithEmailAndPassword,
    updateDoctorById,
    getDoctorById,
    deleteDoctorById,
};
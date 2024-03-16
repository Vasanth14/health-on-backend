const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const doctorSchema = mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
        trim: true,
    },
    doctorEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    specialization: {
        type: String,
        required: true,
        trim: true,
    },
    medicalLicenseNumber: {
        type: String,
        required: true,
        trim: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    educationQualifications: {
        type: String,
        required: true,
        trim: true,
    },
    workHistory: {
        type: String
    },
    specializedTraining: {
        type: String,
    },
    availability: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    hospital: {
        hospitalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hospital',
            required: true
        },
        hospitalName: {
            type: String,
            required: true,
            trim: true,
        },
        hospitalEmailAddress: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        hospitalLocation: {
            type: String,
            required: true,
            trim: true,
        },
        hospitalRegId: {
            type: String,
            required: true,
            trim: true,
        },
        hospitalType: {
            type: String,
            required: true,
            trim: true,
        },
        hospitalContact: {
            type: String,
            required: true,
            trim: true,
        },
        hospitalLogo: {
            type: String,
        },
        role: {
            type: String,
            enum: roles,
            default: 'doctor',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    }
}, {
    timestamps: true,
})


doctorSchema.plugin(toJSON);
doctorSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} doctorEmail - The doctor's email
 * @param {ObjectId} [excludedoctorId] - The id of the doctor to be excluded
 * @returns {Promise<boolean>}
 */
doctorSchema.statics.isEmailTaken = async function (doctorEmail, excludedoctorId) {
    const doctor = await this.findOne({ doctorEmail, _id: { $ne: excludedoctorId } });
    return !!doctor;
  };
  
  /**
   * Check if password matches the doctor's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  doctorSchema.methods.isPasswordMatch = async function (password) {
      const doctor = this;
      return bcrypt.compare(password, doctor.password);
    };
    
    doctorSchema.pre('save', async function (next) {
      const doctor = this;
      if (doctor.isModified('password')) {
        doctor.password = await bcrypt.hash(doctor.password, 8);
      }
      next();
    });
  
    /**
   * @typedef Doctor
   */
  const Doctor = mongoose.model('Doctor', doctorSchema);
  
  module.exports = Doctor;
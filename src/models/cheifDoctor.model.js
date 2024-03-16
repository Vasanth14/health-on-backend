const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const cheifDoctorSchema = mongoose.Schema({
    cheifDoctorName: {
        type: String,
        required: true,
        trim: true,
    },
    cheifDoctorEmail: {
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
            default: 'hospital',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    }
}, {
    timestamps: true,
})


cheifDoctorSchema.plugin(toJSON);
cheifDoctorSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} cheifDoctorEmail - The cheifDoctor's email
 * @param {ObjectId} [excludecheifDoctorId] - The id of the cheifDoctor to be excluded
 * @returns {Promise<boolean>}
 */
cheifDoctorSchema.statics.isEmailTaken = async function (cheifDoctorEmail, excludecheifDoctorId) {
    const cheifDoctor = await this.findOne({ cheifDoctorEmail, _id: { $ne: excludecheifDoctorId } });
    return !!cheifDoctor;
  };
  
  /**
   * Check if password matches the cheifDoctor's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  cheifDoctorSchema.methods.isPasswordMatch = async function (password) {
      const cheifDoctor = this;
      return bcrypt.compare(password, cheifDoctor.password);
    };
    
    cheifDoctorSchema.pre('save', async function (next) {
      const cheifDoctor = this;
      if (cheifDoctor.isModified('password')) {
        cheifDoctor.password = await bcrypt.hash(cheifDoctor.password, 8);
      }
      next();
    });
  
    /**
   * @typedef CheifDoctor
   */
  const CheifDoctor = mongoose.model('CheifDoctor', cheifDoctorSchema);
  
  module.exports = CheifDoctor;
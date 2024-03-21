const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const hospitalSchema = mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalEmail: {
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
    hospitalLocation: {
      type: String,
      required: true,
      trim: true,
    },
    hospitalRegId: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
hospitalSchema.plugin(toJSON);
hospitalSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} hospitalEmail - The hospital's email
 * @param {ObjectId} [excludeHospitalId] - The id of the hospital to be excluded
 * @returns {Promise<boolean>}
 */
hospitalSchema.statics.isEmailTaken = async function (hospitalEmail, excludeHospitalId) {
  const hospital = await this.findOne({ hospitalEmail, _id: { $ne: excludeHospitalId } });
  return !!hospital;
};

/**
 * Check if password matches the hospital's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
hospitalSchema.methods.isPasswordMatch = async function (password) {
    const hospital = this;
    return bcrypt.compare(password, hospital.password);
  };
  
  hospitalSchema.pre('save', async function (next) {
    const hospital = this;
    if (hospital.isModified('password')) {
      hospital.password = await bcrypt.hash(hospital.password, 8);
    }
    next();
  });

  /**
 * @typedef Hospital
 */
const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
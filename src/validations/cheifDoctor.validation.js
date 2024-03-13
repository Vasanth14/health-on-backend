const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getCheifDoctor = {
    params: Joi.object().keys({
        cheifDoctorId: Joi.string().custom(objectId),
    }),
};


const updateCheifDoctor = {
    params: Joi.object().keys({
        cheifDoctorId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            cheifDoctorEmail: Joi.string().email(),
            password: Joi.string().custom(password),
            cheifDoctorName: Joi.string(),
        })
        .min(1),
};

const deleteCheifDoctor = {
    params: Joi.object().keys({
        cheifDoctorId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    getCheifDoctor,
    updateCheifDoctor,
    deleteCheifDoctor
};
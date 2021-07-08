//VALIDATION
const Joi = require('joi');

//Register Validation
function registerValidation(data) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    //VALIDATE DATA BEFORE USER IS CREATED
    return schema.validate(data);
};


//Login Validation
function loginValidation(data) {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    //VALIDATE DATA BEFORE USER IS LOGGED IN
    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
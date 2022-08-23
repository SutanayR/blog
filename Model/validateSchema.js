const Joi=require('joi');
const validatorSchema=Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    number: Joi.string().min(10).pattern(/^\d+$/).required()
});
module.exports ={validatorSchema};
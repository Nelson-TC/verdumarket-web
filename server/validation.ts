import Joi from "joi";

export const PostSchema = Joi.object({
    name: Joi.string().min(3).max(75).required(),
    unitPrice: Joi.number().greater(0).required(),
    unitMeasurement: Joi.string().required(),
    categoryId: Joi.number().integer().required()
})
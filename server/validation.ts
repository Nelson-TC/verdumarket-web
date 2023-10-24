import Joi from "joi";

export const PostSchema = Joi.object({
    name: Joi.string().min(3).max(75).required(),
    unitPrice: Joi.number().greater(0).required(),
    unitMeasurement: Joi.string().required(),
    categoryId: Joi.number().integer().required()
})

const saleItem = Joi.object().keys({
    id: Joi.number().required(),
    quantity: Joi.number().integer().greater(0).required(),
    name: Joi.string().required(),
    unitPrice: Joi.number().greater(0).required(),
    stock: Joi.number().integer().greater(0).required()
}).required()

export const SaleSchema = Joi.object({
    content: Joi.array().items(saleItem).required(),
    createInvoice: Joi.boolean().required()
})

export const CategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required()
})

export const InvoiceSchema = Joi.object({
    name: Joi.string().min(3).max(75).required(),
    address: Joi.string().min(3).max(150).required(),
    nit: Joi.string().min(2).max(10).required()
})

export const InventorySchema = Joi.object({
  content: Joi.array().items(saleItem).required() 
})
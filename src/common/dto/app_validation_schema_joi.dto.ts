import * as Joi from "joi";

export const appValidationSchemaJoi = Joi.object({
    DB_NAME: Joi.required(),
    DB_USERNAME: Joi.required(),
    DB_PASSWORD: Joi.required(),
    DB_PORT: Joi.number(),
    DEFAULT_PAGINATION_LIMIT: Joi.number().default(10),
    PORT: Joi.number().default(3000)
});
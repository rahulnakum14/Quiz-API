import Joi from "joi";

/**
 * Validate Blog details..
 */
const blogSchema = Joi.object({
  title: Joi.string().empty().messages({
    "string.empty": "title is not allowed to be empty",
  }),
  description: Joi.string().empty().messages({
    "string.empty": "description is not allowed to be empty",
  }),
  imageUrl: Joi.string().uri().empty().messages({
    "string.empty": "description is not allowed to be empty",
  }),
});

export { blogSchema };

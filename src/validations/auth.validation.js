import Joi from 'joi';

export const signupValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().trim().optional().messages({
      "string.base": "First name should be a string",
      "string.empty": "First name cannot be empty",
      "any.required": "First name is required"
    }),
    last_name: Joi.string().trim().optional().messages({
      "string.base": "Last name should be a string",
      "string.empty": "Last name cannot be empty",
      "any.required": "Last name is required"
    }),
    username: Joi.string()
      .trim()
      .optional()
      .regex(/^[a-zA-Z]\w{3,31}$/)
      .messages({
        "string.base": "Username should be a string",
        "string.empty": "Username cannot be empty",
        "string.pattern.base": "Username should start with an alphabet character and may contain alphanumeric characters as well as underscores",
        "any.required": "Username is required"
      }),
    phone: Joi.string().trim().optional().messages({
      "string.base": "Phone number should be a string",
      "string.empty": "Phone number cannot be empty",
      "any.required": "Phone number is required",
      "string.pattern.base": "Phone number is invalid: Please provide a valid phone number"
    }),
    email: Joi.string().lowercase().email().trim().required().messages({
      "string.base": "Email address should be a string",
      "string.empty": "Email address cannot be empty",
      "string.email": "Email address is invalid: Please provide a valid email address",
      "any.required": "Email address is required"
    }),
    password: Joi.string()
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      .trim()
      .required()
      .messages({
        "string.base": "Password should be a string",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
        "string.pattern.base": "Password is not valid, It should contains 1 uppercase, 1 lowercase 1 number and 1 special character with min 8 characters"
      }),
    confirm_password: Joi.string().trim().required().messages({
      "string.base": "Confirm password should be a string",
      "string.empty": "Confirm password cannot be empty",
      "any.required": "Confirm password is required"
    }),
    referred_by: Joi.string().allow("").trim().optional().messages({
      "string.base": "Referred by should be a string"
    }),
  });
  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().required().messages({
      "string.base": "Email address should be a string",
      "string.empty": "Email address cannot be empty",
      "any.required": "Email address is required"
    }),
    password: Joi.string().trim().required().messages({
      "string.base": "Password should be a string",
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required"
    })
  });
  return schema.validate(data);
};

export const userLoginSessionValidation = (data) => {
  const schema = Joi.object({
    login_session: Joi.string().trim().required().messages({
      "string.base": "Login session should be a string",
      "string.empty": "Login session cannot be empty",
      "any.required": "Login session is required"
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
      "string.base": "Email address should be a string",
      "string.empty": "Email address cannot be empty",
      "any.required": "Email address is required"
    })
  });
  return schema.validate(data);
};

export const refreshTokenValidation = (data) => {
  const schema = Joi.object({
    refresh_token: Joi.string().trim().required().messages({
      "string.base": "Refresh token should be a string",
      "string.empty": "Refresh token cannot be empty",
      "any.required": "Refresh token is required"
    })
  });
  return schema.validate(data);
};
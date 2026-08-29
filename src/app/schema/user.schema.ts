import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService } from "../../services/field-helper.service";
import { configuration } from "../../configs";

export const userSchema = {

  loginSchema: joi.object({
    identifier: joi.string().trim().required().messages({
      "string.empty": `Mobile , email address or security Code is required as identifier.`,
      "any.required": `Mobile , email address or security Code is required as identifier.`
    }),
    password: joi.string().trim().max(60).required().messages({
      "string.empty": `Password is required.`,
      "any.required": `Password is required.`,
      "string.max": `Password length must be less than or equal to 60 characters long.`,
    })
  }),

  AddSchema: joi.object({
    name: joi.string().trim().max(500).required().messages({
      "string.empty": `User name is required.`,
      "any.required": `User name is required.`,
      "string.max": `User name must be less than 500 characters.`
    }),
    emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
      "string.empty": `Email address is required.`,
      "any.required": `Email address is required.`,
      "string.max": `Email address length must be less than or equal to 320 characters long.`,
      'string.pattern.base': `Email address is invalid.`
    }),
    mobileNo: joi.string().trim().max(10).pattern(configuration.mobileNoPattern).required().messages({
      "string.empty": `Mobile no. is required.`,
      "any.required": `Mobile no. is required.`,
      "string.max": `Mobile no. length must be less than or equal to 10 characters long.`,
      'string.pattern.base': `Mobile no. is invalid.`
    }),
    address : joi.string().trim().max(1000).required().messages({
      "string.empty": `Address is required.`,
      "any.required": `Address is required.`,
      "string.max": `Address must be less than 1000 characters.`
    }),
    profileImage: joi.string().trim().max(300).required().allow("").messages({
      "any.required": `Profile image is required.`,
      "string.max": `Profile image must be less than 300 characters.`,
      "string.empty": `Profile image is required.`
    }),
    password: joi.string().min(6).max(100).required().messages({
      "any.required": `Password is required.`
    }),
  }),

  UpdateSchema: joi.object({
    userId: joi.number().integer().positive().required().messages({
      "any.required": `User id is required.`,
      "number.base": `User id must be a number`,
      "number.positive": `User id must be a positive number`,
    }),
    name: joi.string().trim().max(500).required().messages({
      "string.empty": `User name is required.`,
      "any.required": `User name is required.`,
      "string.max": `User name must be less than 500 characters.`
    }),
    address : joi.string().trim().max(1000).required().messages({
      "string.empty": `Address is required.`,
      "any.required": `Address is required.`,
      "string.max": `Address must be less than 1000 characters.`
    }),
    profileImage: joi.string().trim().max(300).required().allow("").messages({
      "any.required": `Profile image is required.`,
      "string.max": `Profile image must be less than 300 characters.`,
      "string.empty": `Profile image is required.`
    }),
    emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
      "string.empty": `Email address is required.`,
      "any.required": `Email address is required.`,
      "string.max": `Email address length must be less than or equal to 320 characters long.`,
      'string.pattern.base': `Email address is invalid.`
    }),
    mobileNo: joi.string().trim().max(10).pattern(configuration.mobileNoPattern).required().messages({
      "string.empty": `Mobile no. is required.`,
      "any.required": `Mobile no. is required.`,
      "string.max": `Mobile no. length must be less than or equal to 10 characters long.`,
      'string.pattern.base': `Mobile no. is invalid.`
    }),
  }),

  StatusSchema: joi.object({
    userId: joi.number().integer().positive().required().messages({
      "any.required": `User id is required.`,
      "number.base": `User id must be a number`,
      "number.positive": `User id must be a positive number`,
    }),
    status: joi.string().valid('ACTIVE', 'DEACTIVE').required()
  }),

  SelectByIdSchema: joi.object({
    userId: joi.number().integer().positive().required().messages({
      "any.required": `User id is required.`,
      "number.base": `User id must be a number`,
      "number.positive": `User id must be a positive number`,
    }),
  }),

  SearchUserSchema: joi.object({
    name: joi.string().trim().max(500).allow("").messages({
      "string.max": `User name length must be less than or equal to 500 characters long.`
    }),
    emailId: joi.string().trim().max(320).allow("").messages({
      "string.max": `Email address length must be less than or equal to 320 characters long.`
    }),
    mobileNo: joi.string().trim().max(15).allow("").messages({
      "string.max": `Mobile no. length must be less than or equal to 15 characters long.`
    }),
    userType: joi.string().trim().valid('SUPER_ADMIN', 'ADMIN', 'SUB_ADMIN','EMPLOYEE').allow("").messages({
      "any.only": `User type must be one of SUPER_ADMIN, ADMIN, SUB_ADMIN or EMPLOYEE.`
    }),
    status: joi.string().trim().valid('ACTIVE', 'DEACTIVE').allow("").messages({
      "any.only": `Status must be ACTIVE or DEACTIVE.`
    }),
    search: joi.string().trim().allow("").required().messages({
      "any.required": `Search is required.`
    }),
    page: joi.number().integer().positive().required().messages({
      "any.required": `Page is required.`,
      "number.base": `Page must be a number.`,
      "number.positive": `Page must be a positive number.`
    }),
    noOf: joi.number().integer().positive().required().messages({
      "any.required": `No of is required.`,
      "number.base": `No of must be a number.`,
      "number.positive": `No of must be a positive number.`
    }),

    filter: joi.array().items(joi.object({
      key: joi.string().trim().required().messages({
        "string.empty": `Key is required.`,
        "any.required": `Key is required.`
      }),
      type: joi.string().trim().valid('contains', 'equals', 'start with', 'end with').required().messages({
        "any.required": `Type is required.`,
        "any.only": `Type must be one of 'contains', 'equals', 'start with' or 'end with'.`
      }),
      value: joi.string().trim().required().messages({
        "string.empty": `Value is required.`,
        "any.required": `Value is required.`
      })
    })
    ).default([]),

    orderBy: joi.array().items(
      joi.object({
        key: joi.string().trim().required().messages({
          "string.empty": `Key is required.`,
          "any.required": `Key is required.`
        }),
        orderType: joi.string().trim().valid('asc', 'desc').required().messages({
          "any.required": `Order type is required.`,
          "any.only": `Order type must be one of Ascending or Descending.`
        })
      })
    ).default([])

  }),

  passwordUpdateSchema: joi.object({
    oldPassword: joi.string().trim().max(60).required().messages({
      "string.empty": `Old Password is required.`,
      "any.required": `Old Password is required.`,
      "string.max": `Old Password length must be less than or equal to 60 characters long.`,
    }),
    newPassword: joi.string().trim().max(60).required().messages({
      "string.empty": `New Password is required.`,
      "any.required": `New Password is required.`,
      "string.max": `New Password length must be less than or equal to 60 characters long.`,
    })
  }),

  adminPasswordUpdateSchema: joi.object({
    userId: joi.number().integer().positive().required().messages({
      "any.required": `User id is required.`,
      "number.base": `User id must be a number`,
      "number.positive": `User id must be a positive number`,
    }),
    password: joi.string().trim().min(6).max(100).required().messages({
      "string.empty": `Password is required.`,
      "any.required": `Password is required.`,
      "string.min": `Password must be at least 6 characters long.`,
      "string.max": `Password must be less than or equal to 100 characters long.`,
    })
  }),

  forgotPasswordSchema: joi.object({
    emailId: joi.string().trim().max(320).pattern(configuration.emailAddressPattern).required().messages({
      "string.empty": `Email address is required.`,
      "any.required": `Email address is required.`,
      "string.max": `Email address length must be less than or equal to 320 characters long.`,
      "string.pattern.base": `Email address is invalid.`
    })
  }),

  resetPasswordSchema: joi.object({
    token: joi.string().trim().required().messages({
      "string.empty": `Reset token is required.`,
      "any.required": `Reset token is required.`
    }),
    newPassword: joi.string().trim().min(6).max(100).required().messages({
      "string.empty": `New password is required.`,
      "any.required": `New password is required.`,
      "string.min": `New password must be at least 6 characters long.`,
      "string.max": `New password must be less than or equal to 100 characters long.`
    })
  }),

};

export const logInSanitize = async (req: any, res: any, next: any) => {

  const fieldsToSanitize = [
    "identifier", "password" 
  ];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const addUserSanitize = async (req: any, res: any, next: any) => {

  const fieldsToSanitize = [
    "name", "emailId", "mobileNo", "password","address" , "profileImage"
  ];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const updateUserSanitize = async (req: any, res: any, next: any) => {

  const fieldsToSanitize = [
    "userId", "name", "emailId", "mobileNo", "address" , "profileImage"
  ];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const statusUserSanitize = async (req: any, res: any, next: any) => {

  const fieldsToSanitize = [
    "userId", "status"
  ];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const selectByUserIdSanitize = (req: any, res: any, next: any) => {

  if (FieldHelperService.undefinedAndNullCheck(req.params.userId)) {
    req.params.userId = decode(req.sanitize(req.params.userId));
  }

  next();
};

export const userSearchSanitize = async (req: any, res: any, next: any) => {

  const fieldsToSanitize = [
    "name", "emailId", "mobileNo", "userType", "status", "search", "page", "noOf"
  ];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }
  if (req.body.filter && Array.isArray(req.body.filter)) {
    for (const element of req.body.filter) {
      if (FieldHelperService.undefinedAndNullCheck(element.key)) {
        element.key = decode(req.sanitize(element.key));
      }
      if (FieldHelperService.undefinedAndNullCheck(element.type)) {
        element.type = decode(req.sanitize(element.type));
      }
      if (FieldHelperService.undefinedAndNullCheck(element.value)) {
        element.value = decode(req.sanitize(element.value + ""));
      }
    }
  }
  if (req.body.orderBy && Array.isArray(req.body.orderBy)) {
    for (const element of req.body.orderBy) {
      if (FieldHelperService.undefinedAndNullCheck(element.key)) {
        element.key = decode(req.sanitize(element.key));
      }
      if (FieldHelperService.undefinedAndNullCheck(element.orderType)) {
        element.orderType = decode(req.sanitize(element.orderType));
      }
    }
  }

  next();
};

export const passwordUpdateSanitize = (req: any, res: any, next: any) => {
  const fieldsToSanitize = ["oldPassword", "newPassword"];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const adminPasswordUpdateSanitize = (req: any, res: any, next: any) => {
  const fieldsToSanitize = ["userId", "password"];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();
};

export const forgotPasswordSanitize = (req: any, res: any, next: any) => {

  if (FieldHelperService.undefinedAndNullCheck(req.body.emailId)) {
    req.body.emailId = decode(req.sanitize(req.body.emailId + ""));
  }

  next();

};

export const resetPasswordSanitize = (req: any, res: any, next: any) => {

  const fieldsToSanitize = ["token", "newPassword"];

  for (const field of fieldsToSanitize) {
    if (FieldHelperService.undefinedAndNullCheck(req.body[field])) {
      req.body[field] = decode(req.sanitize(req.body[field] + ""));
    }
  }

  next();

};

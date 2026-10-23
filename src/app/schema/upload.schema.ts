import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService, FormService } from "../../services";

export const uploadSchemas = {
  AddFileSchema: joi.object({
    fields: joi.object({
      folder: joi.string().trim().allow("").required().messages({
        "string.base": `Folder name must be a string.`,
        "any.required": `Folder name is required.`,
      }),
    }).required().messages({
      "any.required": `Fields are required.`
    }),
    files: joi.object({
      file: joi.array().required().items(
        joi.object({
          headers: joi.object({
            'content-type': joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp').required().messages({
              'any.only': `Image must be one of image/jpeg, image/jpg, image/png, image/webp.`,
              'any.required': `Content type is required.`
            })
          }).unknown().required().messages({
            'any.required': `Headers are required.`
          }),
          size: joi.number().max(5 * 1024 * 1024).required().messages({
            'number.base': `File size must be a number.`,
            'number.max': `Image must be less than or equal to 5 MB.`,
            'any.required': `File size is required.`
          })
        }).unknown()
      ).messages({
        "array.base": `File must be an array.`,
        "any.required": `File array is required.`
      })
    }).unknown().required().messages({
      "any.required": `Files object is required.`
    })
  }),
  RemoveFileSchema: joi.object({
    file: joi.array().items(
      joi.object({
        filePath: joi.string().required().messages({
          "string.base": `File path must be a string.`,
          "string.empty": `File path is required.`,
          "any.required": `File path is required.`
        })
      })).required().messages({
        "array.base": `File list must be an array.`,
        "any.required": `File is required.`,
      })
  })
};

export const addFileSanitize = async (req: any, res: any, next: any) => {
  const form = new FormService(req);
  const formObject: any = await form.parse();
  if (formObject.files || formObject.fields) {
    const body = formObject.fields;
    if (FieldHelperService.undefinedAndNullCheck(body.folder)) {
      body.folder = decode(req.sanitize(body.folder));
    }
    formObject.fields = body;
    req.body = formObject;
    next();
  }
  else {
    res.status(422).send({ status: 0, message: formObject.message });
  }
};

export const removeFileSanitize = async (req: any, res: any, next: any) => {
  if (FieldHelperService.undefinedAndNullCheck(req.body.file)) {
    for (const key in req.body.file) {
      const element = req.body.file[key];
      if (FieldHelperService.undefinedAndNullCheck(element.filePath)) {
        element.filePath = decode(req.sanitize(element.filePath));
      }
    }
  }
  next();
};
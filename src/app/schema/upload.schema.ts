import joi from "joi";
import { decode } from 'html-entities';
import { FieldHelperService, FormService } from "../../services";

export const uploadSchemas = {
  AddFileSchema: joi.object({
    fields: joi.object({
      folder: joi.string().trim().required().messages({
        "string.empty": `Folder name is required.`,
        "any.required": `Folder name is required.`,
      }),
    }),
    files: joi.object({
      file: joi.array().required().items(
        joi.object({
          headers: joi.object({
            'content-type': joi.string().valid('image/jpeg', 'image/jpg', 'image/png', 'image/webp').required().messages({
              'any.only': `Image must be one of image/jpeg, image/jpg, image/png, image/webp.`,
            })
          }).unknown(),
          size: joi.number().max(5 * 1024 * 1024).required().messages({
            'number.max': `Image must be less than or equal to 5 MB.`
          })
        }).unknown()
      )
    }).unknown()
  }),
  RemoveFileSchema: joi.object({
    file: joi.array().items(
      joi.object({
        filePath: joi.string().required().messages({
          "string.empty": `File path is required.`,
          "any.required": `File path is required.`
        })
      })).required().messages({
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
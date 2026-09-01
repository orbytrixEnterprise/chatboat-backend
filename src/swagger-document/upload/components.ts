const components = {
  schemas: {

    addFileInput: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'Destination folder name where files will be uploaded',
          example: 'avatars'
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'The binary file to upload'
        }
      }
    },

    removeFileItem: {
      type: 'object',
      required: ['filePath'],
      properties: {
        filePath: {
          type: 'string',
          description: 'Storage path of the file to remove',
          example: 'uploads/avatars/image.png'
        }
      }
    },

    removeFileInput: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/removeFileItem'
          }
        }
      }
    },

    uploadSuccessOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'File uploaded successfully.'
        },
        data: {
          type: 'array',
          items: {
            type: 'string',
            example: 'uploads/avatars/uploaded-filename.png'
          }
        }
      }
    },

    uploadCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'File removed successfully.'
        }
      }
    }
  }
};

export default { ...components };

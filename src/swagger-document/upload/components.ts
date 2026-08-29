import response from '../../configs/response';

const components = {
  schemas: {

    uploadFileInput: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'The name of the folder to upload the file into.',
          example: 'user-uploads'
        },
        file: {
          type: 'array',
          description: 'Multiple image files (jpeg, jpg, png, webp; max 1MB each)',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      },
      required: ['folder', 'file']
    },

    uploadFileOutput: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 1 },
        message: { type: 'string', example: response['112'] },
        data: {
          type: 'string',
          example: 'uploads/image1.png'
        }
      }
    },

   
    uploadFileBulkInput: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'Folder name where files will be uploaded.',
          example: 'user-uploads'
        },
        file: {
          type: 'array',
          description: 'Multiple image files (jpeg, jpg, png, webp; max 1MB each)',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      },
      required: ['folder', 'file']
    },

    uploadFileBulkOutput: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 1 },
        message: {
          type: 'string',
          example: 'Files uploaded successfully'
        },
        data: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'uploads/image1.png',
            'uploads/image2.png'
          ]
        }
      }
    },

    removeFileInput: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                example: 'uploads/image1.png'
              }
            },
            required: ['filePath']
          }
        }
      },
      required: ['file']
    },

    removeFileOutput: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 1 },
        message: { type: 'string', example: response['114'] }
      }
    },
    
    removeFileBulkInput: {
      type: 'object',
      properties: {
        file: {
          type: 'array',
          description: 'List of file paths to remove',
          items: {
            type: 'object',
            properties: {
              filePath: {
                type: 'string',
                example: 'uploads/image1.png'
              }
            },
            required: ['filePath']
          }
        }
      },
      required: ['file']
    },

    removeFileBulkOutput: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 1 },
        message: {
          type: 'string',
          example: 'Files removed successfully'
        }
      }
    }

  }
};

export default { ...components };
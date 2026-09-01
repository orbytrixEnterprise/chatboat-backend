const components = {
  schemas: {

    addCategoryInput: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          description: 'Name of the Category',
          example: 'Historical Figures'
        },
        priority: {
          type: 'integer',
          description: 'Weight for grid listing priority',
          example: 1
        },
        status: {
          type: 'string',
          enum: ["ACTIVE", "INACTIVE"],
          example: 'ACTIVE'
        }
      }
    },

    updateCategoryInput: {
      type: 'object',
      required: ['categoryId'],
      properties: {
        categoryId: {
          type: 'integer',
          description: 'Numeric category identifier',
          example: 1
        },
        name: {
          type: 'string',
          example: 'Historical Figures'
        },
        priority: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          enum: ["ACTIVE", "INACTIVE"],
          example: 'ACTIVE'
        }
      }
    },

    searchCategoryInput: {
      type: 'object',
      required: ['page', 'noOf'],
      properties: {
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        search: {
          type: 'string',
          example: ''
        },
        page: {
          type: 'integer',
          example: 1
        },
        noOf: {
          type: 'integer',
          example: 10
        },
        filter: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                example: 'status'
              },
              type: {
                type: 'string',
                example: 'equals'
              },
              value: {
                type: 'string',
                example: 'ACTIVE'
              }
            }
          }
        },
        orderBy: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                example: 'priority'
              },
              orderType: {
                type: 'string',
                example: 'asc'
              }
            }
          }
        }
      }
    },

    categoryRowOutput: {
      type: 'object',
      properties: {
        'category_id': {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: 'Historical Figures'
        },
        priority: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'creating_date': {
          type: 'string',
          example: '2026-08-30T12:00:00.000Z'
        },
        'updating_date': {
          type: 'string',
          example: '2026-08-30T12:00:00.000Z'
        }
      }
    },

    categoryOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Category details retrieved successfully.'
        },
        data: {
          $ref: '#/components/schemas/categoryRowOutput'
        }
      }
    },

    categorySearchOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Categories retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/categoryRowOutput'
              }
            },
            page: {
              type: 'integer',
              example: 1
            },
            noOf: {
              type: 'integer',
              example: 10
            },
            total: {
              type: 'integer',
              example: 1
            }
          }
        }
      }
    },

    categoryCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Category operation completed successfully.'
        }
      }
    }
  }
};

export default { ...components };

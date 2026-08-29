const components = {
  schemas: {

    addAiKeyInput: {
      type: 'object',
      required: ['provider', 'apiKey', 'model'],
      properties: {
        provider: {
          type: 'string',
          description: 'AI provider (grok, openai, gemini, or claude)',
          example: 'grok'
        },
        apiKey: {
          type: 'string',
          description: 'Provider API Key credential',
          example: 'xai-grok-api-key-here'
        },
        model: {
          type: 'string',
          description: 'Model identifier name',
          example: 'grok-beta'
        },
        baseUrl: {
          type: 'string',
          description: 'Optional proxy base URL override',
          example: ''
        },
        priority: {
          type: 'integer',
          description: 'Priority ranking (lower values tried first)',
          example: 1
        },
        status: {
          type: 'string',
          description: 'Status of key (ACTIVE or INACTIVE)',
          example: 'ACTIVE'
        }
      }
    },

    updateAiKeyInput: {
      type: 'object',
      required: ['keyId', 'provider', 'apiKey', 'model'],
      properties: {
        keyId: {
          type: 'integer',
          description: 'Numeric key identifier',
          example: 1
        },
        provider: {
          type: 'string',
          description: 'AI provider',
          example: 'grok'
        },
        apiKey: {
          type: 'string',
          example: 'xai-grok-api-key-here'
        },
        model: {
          type: 'string',
          example: 'grok-beta'
        },
        baseUrl: {
          type: 'string',
          example: ''
        },
        priority: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        }
      }
    },

    statusAiKeyInput: {
      type: 'object',
      required: ['keyId', 'status'],
      properties: {
        keyId: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        }
      }
    },

    searchAiKeyInput: {
      type: 'object',
      required: ['page', 'noOf'],
      properties: {
        provider: {
          type: 'string',
          example: 'grok'
        },
        model: {
          type: 'string',
          example: 'grok-beta'
        },
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
                example: 'provider'
              },
              type: {
                type: 'string',
                example: 'equals'
              },
              value: {
                type: 'string',
                example: 'grok'
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

    aiKeyRowOutput: {
      type: 'object',
      properties: {
        'key_id': {
          type: 'integer',
          example: 1
        },
        provider: {
          type: 'string',
          example: 'grok'
        },
        'api_key': {
          type: 'string',
          example: 'xai-grok-api-key-here'
        },
        model: {
          type: 'string',
          example: 'grok-beta'
        },
        'base_url': {
          type: 'string',
          example: ''
        },
        priority: {
          type: 'integer',
          example: 1
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'fail_count': {
          type: 'integer',
          example: 0
        },
        'last_failed_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        },
        'last_used_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        },
        'creating_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        }
      }
    },

    aiKeyOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'AI API Key details retrieved successfully.'
        },
        data: {
          $ref: '#/components/schemas/aiKeyRowOutput'
        }
      }
    },

    aiKeySearchOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'AI API Keys retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/aiKeyRowOutput'
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

    aiKeyCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'AI API Key operation completed successfully.'
        }
      }
    }
  }
};

export default { ...components };

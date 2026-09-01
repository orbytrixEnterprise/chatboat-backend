const components = {
  schemas: {

    addCharacterInput: {
      type: 'object',
      required: ['name', 'personalityPrompt'],
      properties: {
        name: {
          type: 'string',
          description: 'Name of the AI character',
          example: 'Sherlock Holmes'
        },
        avatarImage: {
          type: 'string',
          description: 'URL of the character avatar image',
          example: 'https://orbytrix.com/images/sherlock.png'
        },
        title: {
          type: 'string',
          description: 'Short character subtitle/title',
          example: 'Consulting Detective'
        },
        tagline: {
          type: 'string',
          description: 'Character tagline or catchphrase',
          example: 'Elementary, my dear Watson.'
        },
        description: {
          type: 'string',
          description: 'Detailed character biography or background',
          example: 'A fictional consulting detective created by Arthur Conan Doyle.'
        },
        categoryId: {
          type: 'string',
          description: 'MongoDB Document ID of the category from Category Master',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        greetingMessage: {
          type: 'string',
          description: 'Initial message sent by the character when chat starts',
          example: 'Hello! I am Sherlock Holmes. What case are we solving today?'
        },
        personalityPrompt: {
          type: 'string',
          description: 'System instructions that guide the personality, tone, and traits of the AI',
          example: 'You are Sherlock Holmes. Speak in a sophisticated, Victorian-era analytical tone. Focus on deductive reasoning.'
        },
        temperature: {
          type: 'number',
          description: 'Creativity temperature (0.0 to 1.0)',
          example: 0.5
        },
        maxTokens: {
          type: 'integer',
          description: 'Max tokens allowed for responses',
          example: 250
        },
        exampleConversations: {
          type: 'string',
          description: 'Example few-shot dialog prompts to train the character model style',
          example: 'User: Who are you?\nAssistant: I am Sherlock Holmes, consulting detective.'
        },
        priority: {
          type: 'integer',
          description: 'Weight for grid listing priority',
          example: 10
        },
        status: {
          type: 'string',
          enum: ["ACTIVE", "INACTIVE"],
          example: 'ACTIVE'
        }
      }
    },

    updateCharacterInput: {
      type: 'object',
      required: ['characterId'],
      properties: {
        characterId: {
          type: 'integer',
          description: 'Numeric character identifier',
          example: 1
        },
        name: {
          type: 'string',
          example: 'Sherlock Holmes'
        },
        avatarImage: {
          type: 'string',
          example: 'https://orbytrix.com/images/sherlock.png'
        },
        title: {
          type: 'string',
          example: 'Consulting Detective'
        },
        tagline: {
          type: 'string',
          example: 'Elementary, my dear Watson.'
        },
        description: {
          type: 'string',
          example: 'A fictional consulting detective created by Arthur Conan Doyle.'
        },
        categoryId: {
          type: 'string',
          description: 'MongoDB Document ID of the category',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        greetingMessage: {
          type: 'string',
          example: 'Hello! I am Sherlock Holmes. What case are we solving today?'
        },
        personalityPrompt: {
          type: 'string',
          example: 'You are Sherlock Holmes. Speak in a sophisticated, Victorian-era analytical tone. Focus on deductive reasoning.'
        },
        temperature: {
          type: 'number',
          example: 0.5
        },
        maxTokens: {
          type: 'integer',
          example: 250
        },
        exampleConversations: {
          type: 'string',
          example: 'User: Who are you?\nAssistant: I am Sherlock Holmes, consulting detective.'
        },
        priority: {
          type: 'integer',
          example: 10
        },
        status: {
          type: 'string',
          enum: ["ACTIVE", "INACTIVE"],
          example: 'ACTIVE'
        }
      }
    },

    searchCharacterInput: {
      type: 'object',
      required: ['page', 'noOf'],
      properties: {
        categoryId: {
          type: 'string',
          example: '64f0a2d2ef48c66e2c39fa10'
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
                example: 'categoryId'
              },
              type: {
                type: 'string',
                example: 'equals'
              },
              value: {
                type: 'string',
                example: '64f0a2d2ef48c66e2c39fa10'
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
                example: 'desc'
              }
            }
          }
        }
      }
    },

    characterRowOutput: {
      type: 'object',
      properties: {
        'character_id': {
          type: 'integer',
          example: 1
        },
        name: {
          type: 'string',
          example: 'Sherlock Holmes'
        },
        'avatar_image': {
          type: 'string',
          example: 'https://orbytrix.com/images/sherlock.png'
        },
        title: {
          type: 'string',
          example: 'Consulting Detective'
        },
        tagline: {
          type: 'string',
          example: 'Elementary, my dear Watson.'
        },
        description: {
          type: 'string',
          example: 'A fictional consulting detective created by Arthur Conan Doyle.'
        },
        'category_id': {
          type: 'string',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        'category_name': {
          type: 'string',
          example: 'Historical Figures'
        },
        'greeting_message': {
          type: 'string',
          example: 'Hello! I am Sherlock Holmes. What case are we solving today?'
        },
        'personality_prompt': {
          type: 'string',
          example: 'You are Sherlock Holmes. Speak in a sophisticated, Victorian-era analytical tone. Focus on deductive reasoning.'
        },
        temperature: {
          type: 'number',
          example: 0.5
        },
        'max_tokens': {
          type: 'integer',
          example: 250
        },
        'example_conversations': {
          type: 'string',
          example: 'User: Who are you?\nAssistant: I am Sherlock Holmes, consulting detective.'
        },
        priority: {
          type: 'integer',
          example: 10
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'created_by': {
          type: 'integer',
          example: 1
        },
        'creating_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        },
        'updating_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        }
      }
    },

    characterOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Character details retrieved successfully.'
        },
        data: {
          $ref: '#/components/schemas/characterRowOutput'
        }
      }
    },

    characterSearchOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Characters retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/characterRowOutput'
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

    characterCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Character operation completed successfully.'
        }
      }
    }
  }
};

export default { ...components };

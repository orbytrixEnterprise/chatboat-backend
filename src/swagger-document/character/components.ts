const components = {
  schemas: {

    addCharacterInput: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          description: 'Name of the AI character',
          example: 'Cyber Samurai'
        },
        avatarImage: {
          type: 'string',
          description: 'URL or relative path of the character avatar image',
          example: 'uploads/characters/avatar-1792767610903-391160.jpg'
        },
        title: {
          type: 'string',
          description: 'Short character subtitle/title',
          example: 'Futuristic Blade Master'
        },
        tagline: {
          type: 'string',
          description: 'Character tagline or catchphrase',
          example: 'Honor in the code, steel in the shadow.'
        },
        description: {
          type: 'string',
          description: 'Detailed character biography or background',
          example: 'A futuristic ronin roaming the neon alleys of Neo-Tokyo.'
        },
        categoryId: {
          type: 'string',
          description: 'MongoDB Document ID or Category name (optional, defaults to General if omitted)',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        greetingMessage: {
          type: 'string',
          description: 'Initial message sent by the character when chat starts',
          example: 'Greetings, traveler. Draw no steel, and we may speak in peace.'
        },
        personalityPrompt: {
          type: 'string',
          description: 'System instructions that guide the personality, tone, and traits of the AI (auto-generated if omitted)',
          example: 'You are Cyber Samurai, a stoic warrior in Neo-Tokyo. Speak with honor and wisdom.'
        },
        temperature: {
          type: 'number',
          description: 'Creativity temperature (0.0 to 1.0)',
          example: 0.7
        },
        maxTokens: {
          type: 'integer',
          description: 'Max tokens allowed for responses',
          example: 250
        },
        exampleConversations: {
          type: 'string',
          description: 'Example few-shot dialog prompts to train the character model style',
          example: 'User: Who are you?\nAssistant: I am Cyber Samurai, guardian of Neo-Tokyo.'
        },
        priority: {
          type: 'integer',
          description: 'Weight for grid listing priority',
          example: 10
        },
        visibility: {
          type: 'string',
          enum: ["PUBLIC", "PRIVATE"],
          description: 'PUBLIC (visible in global explore for all users) or PRIVATE (only visible to creator)',
          example: 'PUBLIC'
        },
        autoGenerateAvatar: {
          type: 'boolean',
          description: 'If true and avatarImage is blank, automatically generates avatar with free AI',
          example: false
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
          example: 'Cyber Samurai'
        },
        avatarImage: {
          type: 'string',
          example: 'uploads/characters/avatar-1792767610903-391160.jpg'
        },
        title: {
          type: 'string',
          example: 'Futuristic Blade Master'
        },
        tagline: {
          type: 'string',
          example: 'Honor in the code, steel in the shadow.'
        },
        description: {
          type: 'string',
          example: 'A futuristic ronin roaming the neon alleys of Neo-Tokyo.'
        },
        categoryId: {
          type: 'string',
          description: 'MongoDB Document ID of the category',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        greetingMessage: {
          type: 'string',
          example: 'Greetings, traveler. Draw no steel, and we may speak in peace.'
        },
        personalityPrompt: {
          type: 'string',
          example: 'You are Cyber Samurai, a stoic warrior in Neo-Tokyo. Speak with honor and wisdom.'
        },
        temperature: {
          type: 'number',
          example: 0.7
        },
        maxTokens: {
          type: 'integer',
          example: 250
        },
        exampleConversations: {
          type: 'string',
          example: 'User: Who are you?\nAssistant: I am Cyber Samurai, guardian of Neo-Tokyo.'
        },
        priority: {
          type: 'integer',
          example: 10
        },
        visibility: {
          type: 'string',
          enum: ["PUBLIC", "PRIVATE"],
          example: 'PRIVATE'
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
        visibility: {
          type: 'string',
          enum: ["PUBLIC", "PRIVATE", "ALL"],
          example: 'PUBLIC'
        },
        myOnly: {
          type: 'boolean',
          description: 'If true, returns only characters created by the authenticated user',
          example: false
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

    generateAvatarInput: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {
          type: 'string',
          description: 'Character name',
          example: 'Cyber Samurai'
        },
        title: {
          type: 'string',
          description: 'Character title or role',
          example: 'Futuristic Blade Master'
        },
        description: {
          type: 'string',
          description: 'Visual description or character backstory',
          example: 'A neon-lit warrior with glowing purple katana and cybernetic armor'
        },
        category: {
          type: 'string',
          description: 'Theme or genre (Anime, Gaming, Fantasy, etc.)',
          example: 'Gaming'
        },
        style: {
          type: 'string',
          description: 'Artistic render style (e.g. anime 3d render, cinematic studio portrait)',
          example: 'anime 3d render, cinematic lighting, masterpiece'
        },
        prompt: {
          type: 'string',
          description: 'Direct prompt override (optional)',
          example: ''
        }
      }
    },

    generateAvatarOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Avatar generated successfully.'
        },
        data: {
          type: 'object',
          properties: {
            avatarImage: {
              type: 'string',
              description: 'Relative local path to saved image',
              example: 'uploads/characters/avatar-1792767610903-391160.jpg'
            },
            imageUrl: {
              type: 'string',
              description: 'Absolute URL ready to load in image view',
              example: 'http://localhost:5025/uploads/characters/avatar-1792767610903-391160.jpg'
            },
            promptUsed: {
              type: 'string',
              description: 'The sanitized synthesis prompt used to generate the image',
              example: 'portrait of Cyber Samurai, Futuristic Blade Master, Gaming theme...'
            }
          }
        }
      }
    },

    myCustomCharactersInput: {
      type: 'object',
      properties: {
        page: {
          type: 'integer',
          example: 1
        },
        noOf: {
          type: 'integer',
          example: 20
        },
        search: {
          type: 'string',
          example: ''
        },
        visibility: {
          type: 'string',
          enum: ["PUBLIC", "PRIVATE", "ALL"],
          example: 'ALL'
        }
      }
    },

    myCustomCharactersOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Your custom characters retrieved successfully.'
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
              example: 20
            },
            total: {
              type: 'integer',
              example: 1
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
          example: 101
        },
        name: {
          type: 'string',
          example: 'Cyber Samurai'
        },
        'avatar_image': {
          type: 'string',
          example: 'uploads/characters/avatar-1792767610903-391160.jpg'
        },
        title: {
          type: 'string',
          example: 'Futuristic Blade Master'
        },
        tagline: {
          type: 'string',
          example: 'Honor in the code, steel in the shadow.'
        },
        description: {
          type: 'string',
          example: 'A futuristic ronin roaming the neon alleys of Neo-Tokyo.'
        },
        'category_id': {
          type: 'string',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        'category_name': {
          type: 'string',
          example: 'Gaming'
        },
        'greeting_message': {
          type: 'string',
          example: 'Greetings, traveler. Draw no steel, and we may speak in peace.'
        },
        'personality_prompt': {
          type: 'string',
          example: 'You are Cyber Samurai, a stoic warrior in Neo-Tokyo. Speak with honor and wisdom.'
        },
        temperature: {
          type: 'number',
          example: 0.7
        },
        'max_tokens': {
          type: 'integer',
          example: 250
        },
        'example_conversations': {
          type: 'string',
          example: 'User: Who are you?\nAssistant: I am Cyber Samurai, guardian of Neo-Tokyo.'
        },
        priority: {
          type: 'integer',
          example: 10
        },
        visibility: {
          type: 'string',
          enum: ["PUBLIC", "PRIVATE"],
          example: 'PUBLIC'
        },
        'is_my_character': {
          type: 'boolean',
          example: true
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'created_by': {
          type: 'integer',
          example: 1024
        },
        'creating_date': {
          type: 'string',
          example: '2026-10-23T12:00:00.000Z'
        },
        'updating_date': {
          type: 'string',
          example: '2026-10-23T12:00:00.000Z'
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

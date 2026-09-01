const components = {
  schemas: {

    startOrGetChatInput: {
      type: 'object',
      required: ['characterId'],
      properties: {
        characterId: {
          type: 'string',
          description: 'MongoDB Document ID of the AI Character',
          example: '64f0a2d2ef48c66e2c39fa10'
        }
      }
    },

    sendMessageInput: {
      type: 'object',
      required: ['conversationId', 'message'],
      properties: {
        conversationId: {
          type: 'integer',
          description: 'Numeric identifier of the conversation',
          example: 1
        },
        message: {
          type: 'string',
          description: 'User message text',
          example: 'Hello Sherlock, my age is 44 and I have a mystery for you to investigate.'
        }
      }
    },

    conversationsInput: {
      type: 'object',
      required: ['page', 'noOf'],
      properties: {
        page: {
          type: 'integer',
          example: 1
        },
        noOf: {
          type: 'integer',
          example: 10
        },
        search: {
          type: 'string',
          example: ''
        }
      }
    },

    chatMessageOutput: {
      type: 'object',
      properties: {
        'message_id': {
          type: 'integer',
          example: 1
        },
        sender: {
          type: 'string',
          enum: ["USER", "CHARACTER"],
          example: 'CHARACTER'
        },
        content: {
          type: 'string',
          example: 'Hello! I am Sherlock Holmes. What case are we solving today?'
        },
        'creating_date': {
          type: 'string',
          example: '2026-09-01T12:00:00.000Z'
        }
      }
    },

    conversationOutput: {
      type: 'object',
      properties: {
        'conversation_id': {
          type: 'integer',
          example: 1
        },
        'character_id': {
          type: 'string',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        'character_name': {
          type: 'string',
          example: 'Sherlock Holmes'
        },
        'character_avatar': {
          type: 'string',
          example: 'https://orbytrix.com/images/sherlock.png'
        },
        'character_title': {
          type: 'string',
          example: 'Consulting Detective'
        },
        title: {
          type: 'string',
          example: 'Sherlock Holmes Chat'
        },
        'user_memories': {
          type: 'array',
          items: {
            type: 'string'
          },
          example: ["User's age is 44"]
        },
        'last_message': {
          type: 'string',
          example: 'Hello! I am Sherlock Holmes.'
        },
        'last_message_date': {
          type: 'string',
          example: '2026-09-01T12:00:00.000Z'
        }
      }
    },

    startOrGetChatOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Conversation ready.'
        },
        data: {
          type: 'object',
          properties: {
            conversation: {
              $ref: '#/components/schemas/conversationOutput'
            },
            messages: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/chatMessageOutput'
              }
            }
          }
        }
      }
    },

    sendMessageOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Message sent and response generated.'
        },
        data: {
          type: 'object',
          properties: {
            'conversation_id': {
              type: 'integer',
              example: 1
            },
            'user_message': {
              $ref: '#/components/schemas/chatMessageOutput'
            },
            'character_message': {
              $ref: '#/components/schemas/chatMessageOutput'
            },
            'user_memories': {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ["User's age is 44"]
            }
          }
        }
      }
    },

    conversationsListOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Conversations retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/conversationOutput'
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

    chatHistoryOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Chat history retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            conversation: {
              $ref: '#/components/schemas/conversationOutput'
            },
            messages: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/chatMessageOutput'
              }
            },
            page: {
              type: 'integer',
              example: 1
            },
            noOf: {
              type: 'integer',
              example: 30
            },
            total: {
              type: 'integer',
              example: 5
            }
          }
        }
      }
    },

    myCharactersInput: {
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
        }
      }
    },

    myCharacterCardOutput: {
      type: 'object',
      properties: {
        'character_id': {
          type: 'string',
          example: '64f0a2d2ef48c66e2c39fa10'
        },
        'character_numeric_id': {
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
          example: '64f0a2d2ef48c66e2c39fa11'
        },
        'category_name': {
          type: 'string',
          example: 'Historical Figures'
        },
        'conversation_id': {
          type: 'integer',
          example: 1
        },
        'last_message': {
          type: 'string',
          example: 'Hello! I am Sherlock Holmes.'
        },
        'last_message_date': {
          type: 'string',
          example: '2026-09-01T12:00:00.000Z'
        }
      }
    },

    myCharactersListOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Chatted characters retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/myCharacterCardOutput'
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

    chatCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Operation completed successfully.'
        }
      }
    }
  }
};

export default { ...components };

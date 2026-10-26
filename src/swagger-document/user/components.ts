/* eslint-disable camelcase */
const components = {
  schemas: {

    guestInput: {
      type: 'object',
      required: ['guestId'],
      properties: {
        guestId: {
          type: 'string',
          description: 'Unique guest/device identifier',
          example: 'device-uuid-12345'
        }
      }
    },

    socialLoginInput: {
      type: 'object',
      required: ['provider', 'socialId', 'emailId'],
      properties: {
        provider: {
          type: 'string',
          description: 'Social provider (google or apple)',
          example: 'google'
        },
        socialId: {
          type: 'string',
          description: 'OAuth social id identifier',
          example: 'google-oauth-1122334455'
        },
        emailId: {
          type: 'string',
          description: 'OAuth user email address',
          example: 'user@gmail.com'
        },
        name: {
          type: 'string',
          description: 'User display name',
          example: 'Alex Rider'
        },
        guestId: {
          type: 'string',
          description: 'Optional guest ID to link session data',
          example: 'device-uuid-12345'
        },
        mergeGuestChats: {
          type: 'boolean',
          description: 'Whether to merge guest chat history (default: true)',
          example: true
        }
      }
    },

    checkSocialInput: {
      type: 'object',
      required: ['provider', 'socialId'],
      properties: {
        provider: {
          type: 'string',
          description: 'Social provider (google or apple)',
          example: 'apple'
        },
        socialId: {
          type: 'string',
          description: 'OAuth social id identifier',
          example: '001234.abcdef'
        },
        emailId: {
          type: 'string',
          description: 'OAuth user email address (if available from provider)',
          example: 'user@example.com'
        },
        guestId: {
          type: 'string',
          description: 'Device guest ID currently in use',
          example: 'device-uuid-12345'
        }
      }
    },

    checkSocialOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Social account verification completed.'
        },
        data: {
          type: 'object',
          properties: {
            isExistingSocialUser: {
              type: 'boolean',
              example: false
            },
            isGuestUser: {
              type: 'boolean',
              example: true
            },
            guestAlreadyLinked: {
              type: 'boolean',
              example: false
            },
            hasGuestData: {
              type: 'boolean',
              example: true
            },
            guestConversationsCount: {
              type: 'integer',
              example: 3
            },
            canMerge: {
              type: 'boolean',
              example: true
            },
            suggestedAction: {
              type: 'string',
              example: 'PROMPT_MERGE_INTO_NEW'
            }
          }
        }
      }
    },

    signupInput: {
      type: 'object',
      required: ['name', 'emailId', 'password'],
      properties: {
        name: {
          type: 'string',
          description: 'User full name',
          example: 'Jane Doe'
        },
        emailId: {
          type: 'string',
          description: 'User email address',
          example: 'jane@example.com'
        },
        mobileNo: {
          type: 'string',
          description: 'Optional mobile number',
          example: '9876543210'
        },
        password: {
          type: 'string',
          description: 'User password (min 6 characters)',
          example: 'SecurePass123'
        },
        guestId: {
          type: 'string',
          description: 'Optional guest ID to link legacy guest session data',
          example: 'device-uuid-12345'
        }
      }
    },

    loginInput: {
      type: 'object',
      required: ['emailId', 'password'],
      properties: {
        emailId: {
          type: 'string',
          description: 'User email address',
          example: 'jane@example.com'
        },
        password: {
          type: 'string',
          description: 'User password',
          example: 'SecurePass123'
        }
      }
    },

    profileUpdateInput: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'Jane Smith'
        },
        mobileNo: {
          type: 'string',
          example: '9876543210'
        },
        address: {
          type: 'string',
          example: '123 Main St, New York, NY'
        },
        profileImage: {
          type: 'string',
          example: 'profile-url.png'
        }
      }
    },

    authOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: "Authentication successful."
        },
        data: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 101
            },
            guestId: {
              type: 'string',
              example: 'device-uuid-12345'
            },
            name: {
              type: 'string',
              example: "Jane Doe"
            },
            emailId: {
              type: 'string',
              example: "jane@example.com"
            },
            mobileNo: {
              type: 'string',
              example: "9876543210"
            },
            userType: {
              type: 'string',
              example: "USER"
            },
            status: {
              type: 'string',
              example: "ACTIVE"
            },
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...'
            },
            refresh_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...'
            }
          }
        }
      }
    },

    profileOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: "Profile retrieved successfully."
        },
        data: {
          type: 'object',
          properties: {
            userId: {
              type: 'integer',
              example: 101
            },
            guestId: {
              type: 'string',
              example: 'device-uuid-12345'
            },
            name: {
              type: 'string',
              example: "Jane Doe"
            },
            emailId: {
              type: 'string',
              example: "jane@example.com"
            },
            mobileNo: {
              type: 'string',
              example: "9876543210"
            },
            userType: {
              type: 'string',
              example: "USER"
            },
            address: {
              type: 'string',
              example: "123 Main St, New York"
            },
            profileImage: {
              type: 'string',
              example: "profile-url.png"
            },
            status: {
              type: 'string',
              example: "ACTIVE"
            }
          }
        }
      }
    },

    userSearchRow: {
      type: 'object',
      properties: {
        'user_id': {
          type: 'integer',
          example: 101
        },
        'guest_id': {
          type: 'string',
          example: 'device-uuid-12345'
        },
        name: {
          type: 'string',
          example: 'Jane Doe'
        },
        'email_id': {
          type: 'string',
          example: 'jane@example.com'
        },
        'mobile_no': {
          type: 'string',
          example: '9876543210'
        },
        'user_type': {
          type: 'string',
          example: 'USER'
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'creating_date': {
          type: 'string',
          example: '2026-08-29T12:00:00.000Z'
        }
      }
    },

    userSearchInput: {
      type: 'object',
      required: ['page', 'noOf'],
      properties: {
        name: {
          type: 'string',
          example: 'Jane'
        },
        emailId: {
          type: 'string',
          example: 'jane@example.com'
        },
        mobileNo: {
          type: 'string',
          example: '9876543210'
        },
        userType: {
          type: 'string',
          example: 'USER'
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        search: {
          type: 'string',
          example: 'Jane'
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
                example: 'name'
              },
              type: {
                type: 'string',
                example: 'contains'
              },
              value: {
                type: 'string',
                example: 'Jane'
              }
            }
          }
        },
        orderBy: {
          type: 'array',
          description: 'Sort ordering fields (defaults to descending order by userId if omitted or empty)',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                example: 'userId'
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

    userSearchOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Users retrieved successfully.'
        },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/userSearchRow'
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

    userCommonOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: 'Your account and associated data have been deleted successfully.'
        }
      }
    }
  }
};

export default { ...components };

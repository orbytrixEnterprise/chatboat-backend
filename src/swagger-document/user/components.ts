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
    }
  }
};

export default { ...components };

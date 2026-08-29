import response from '../../configs/response';

const components = {
  schemas: {

    loginInput: {
      type: 'object',
      properties: {
        identifier: {
          type: 'string',
          description: 'User email address or mobile number',
          example: 'dhairy@gmail.com'
        },
        password: {
          type: 'string',
          description: 'User login password',
          example: '123456'
        },
      }
    },

    loginOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: "Login successful"
        },
        data: {
          type: 'object',
          properties: {
            'user_id': {
              type: 'integer',
              example: 12
            },
            name: {
              type: 'string',
              example: "Rabi Patel"
            },
            'email_id': {
              type: 'string',
              example: "ravi@gmail.com"
            },
            'mobile_no': {
              type: 'string',
              example: "9876543210"
            },
            'user_type': {
              type: 'string',
              example: "ADMIN"
            },
            'employee_id': {
              type: 'integer',
              example: 45
            },
            'company_id': {
              type: 'integer',
              example: 8
            },
            'company_name': {
              type: 'string',
              example: "Saree real-estate"
            },
            'company_email': {
              type: 'string',
              example: "info@shree.com"
            },
            'company_mobile': {
              type: 'string',
              example: "9998887777"
            },
            'access_token': {
              type: 'string',
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXCVI9.eyJpZCI6MSwiZW1wbG95ZWVJZCI6MSwiY29tcGFueUlkIjoxLCJyb2xlIjoiQURNSU4iLCJpcEFkZHJlc3MiOiI6OjEiLCJleHAiOjE3NjgzMDQ0NTMsImlhdCI6MTc2ODMwMjY1M30.RtnLJKKAoo0QyJePa0woCkQ0Ps62AxdZ8Ypl4XXyQxs"
            },
            'refresh_token': {
              type: 'string',
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXCVI9..."
            }
          }
        }
      }
    },


    userAddInput: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'User full name (max 500 characters)',
          example: 'Rahul Patel'
        },
        emailId: {
          type: 'string',
          description: 'User email address',
          example: 'rahul@gmail.com'
        },
        mobileNo: {
          type: 'string',
          description: 'User mobile number',
          example: '9876543210'
        },
        password: {
          type: 'string',
          description: 'User login password',
          example: 'Test@123'
        },
        companyName: {
          type: 'string',
          description: 'Company name',
          example: 'Solvify Tech Pvt Ltd'
        },
        logoImage: {
          type: 'string',
          description: 'Company logo',
          example: 'solvify-logo.png'
        }
      }
    },

    userAddOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['221']
        }
      }
    },

    userUpdateInput: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User unique id',
          example: '64b7f9cbe12a5f001234abcd'
        },
        name: {
          type: 'string',
          description: 'User full name',
          example: 'Rahul Patel'
        },
        emailId: {
          type: 'string',
          description: 'User email address',
          example: 'rahul@gmail.com'
        },
        companyName: {
          type: 'string',
          description: 'Company name',
          example: 'Solvify Tech Pvt Ltd'
        },
        logoImage: {
          type: 'string',
          description: 'Company logo',
          example: 'solvify-logo.png'
        },
        mobileNo: {
          type: 'string',
          description: 'User mobile number',
          example: '9876543210'
        }
      }
    },

    userUpdateOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['222']
        }
      }
    },

    userStatusInput: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'User unique id',
          example: '64b7f9cbe12a5f001234abcd'
        },
        status: {
          type: 'string',
          description: 'User status',
          example: 'ACTIVE'
        }
      }
    },

    userStatusOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['223']
        }
      }
    },

    userOutputWithStatus: {
      type: 'object',
      properties: {
        'user_id': {
          type: 'string',
          example: '64b7f9cbe12a5f001234abcd'
        },
        name: {
          type: 'string',
          example: 'Rahul Patel'
        },
        'email_id': {
          type: 'string',
          example: 'rahul@gmail.com'
        },
        'mobile_no': {
          type: 'string',
          example: '9876543210'
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        }
      }
    },

    userOutputWithoutStatus: {
      type: 'object',
      properties: {
        'user_id': {
          type: 'string',
          example: '64b7f9cbe12a5f001234abcd'
        },
        name: {
          type: 'string',
          example: 'Rahul Patel'
        }
      }
    },

    userSelectActiveOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['225']
        },
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/userOutputWithoutStatus'
          }
        }
      }
    },

    userSelectByIdInput: {
      type: 'string',
      description: 'userId',
      example: '64b7f9cbe12a5f001234abcd'
    },

    userSelectByIdOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['225']
        },
        data: {
          $ref: '#/components/schemas/userOutputWithStatus'
        }
      }
    },

    userSearchRow: {
      type: 'object',
      properties: {
        'user_id': {
          type: 'integer',
          example: 8
        },
        name: {
          type: 'string',
          example: 'Rahul Patel'
        },
        'email_id': {
          type: 'string',
          example: 'rahul@mail.com'
        },
        'mobile_no': {
          type: 'string',
          example: '9876543210'
        },
        'user_type': {
          type: 'string',
          example: 'ADMIN'
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        'company_id': {
          type: 'integer',
          example: 1
        },
        'company_name': {
          type: 'string',
          example: 'ABC Real Estate'
        },
        'employee_count': {
          type: 'integer',
          example: 12
        },
        'creating_date': {
          type: 'string',
          example: '2025-01-10 11:30:00'
        }
      }
    },
    userSearchInput: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Search by user name',
          example: 'Rahul'
        },
        emailId: {
          type: 'string',
          description: 'Search by user email',
          example: 'rahul@mail.com'
        },
        mobileNo: {
          type: 'string',
          description: 'Search by user mobile number',
          example: '9876543210'
        },
        userType: {
          type: 'string',
          description: 'Search by user type',
          example: 'ADMIN'
        },
        status: {
          type: 'string',
          description: 'Search by user status',
          example: 'ACTIVE'
        },
        companyName: {
          type: 'string',
          description: 'Search by company name',
          example: 'ABC Real Estate'
        },
        employeeCount: {
          type: 'integer',
          description: 'Search by employee count',
          example: 5
        },
        search: {
          type: 'string',
          description: 'Global search keyword',
          example: 'rahul'
        },
        page: {
          type: 'integer',
          description: 'Page number',
          example: 1
        },
        noOf: {
          type: 'integer',
          description: 'Number of records per page',
          example: 10
        },
        filter: {
          type: 'array',
          description: 'Advanced filter conditions',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                example: 'employee_count'
              },
              type: {
                type: 'string',
                example: '>'
              },
              value: {
                type: 'string',
                example: '3'
              }
            }
          }
        },
        orderBy: {
          type: 'array',
          description: 'Sorting options',
          items: {
            type: 'object',
            properties: {
              key: {
                type: 'string',
                example: 'employee_count'
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
          example: response['267']
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
              description: 'Total matching user records',
              example: 25
            }
          }
        }
      }
    },

    userPasswordUpdateInput: {
      type: 'object',
      properties: {
        oldPassword: {
          type: 'string',
          description: "User's old password",
          example: '123456'
        },
        newPassword: {
          type: 'string',
          description: "User's new password",
          example: '123456'
        }
      }
    },
    userPasswordUpdateOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['203']
        }
      }
    },

    userCompanyDetailsUpdateInput: {
      type: 'object',
      properties: {
        companyName: {
          type: 'string',
          description: 'Company name',
          example: 'Solvify Tech Pvt Ltd'
        },
        emailId: {
          type: 'string',
          description: 'User email address',
          example: 'solvifytech@gmail.com'
        },
        mobileNo: {
          type: 'string',
          description: 'User mobile number',
          example: '9876543210'
        },
        gstNo: {
          type: 'string',
          example: '24ABCDE1234F1Z5'
        },
        address: {
          type: 'string',
          description: 'Company address',
          example: 'Mota varacha, surat.'
        },
        logoImage: {
          type: 'string',
          description: 'Company logo',
          example: 'solvify-logo.png'
        }
      }
    },

    userCompanyDetailsUpdateOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['233']
        }
      }
    },

    adminPasswordUpdateInput: {
      type: 'object',
      properties: {
        userId: {
          type: 'integer',
          description: 'User ID whose password will be changed',
          example: 5
        },
        password: {
          type: 'string',
          description: 'New password',
          example: 'newpassword123'
        }
      }
    },

    adminPasswordUpdateOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['203']
        }
      }
    },

    userForgotPasswordInput: {
      type: 'object',
      required: ['emailId'],
      properties: {
        emailId: {
          type: 'string',
          description: 'Registered email address of the user',
          example: 'rahul@gmail.com'
        }
      }
    },

    userForgotPasswordOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['236']
        }
      }
    },

    userResetPasswordInput: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: {
          type: 'string',
          description: 'Reset token received in the email link',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        newPassword: {
          type: 'string',
          description: 'New password (min 6, max 100 characters)',
          example: 'NewPass@123'
        }
      }
    },

    userResetPasswordOutput: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          example: 1
        },
        message: {
          type: 'string',
          example: response['203']
        }
      }
    },

  }
};

export default { ...components };

import response from '../../configs/response';
import { common } from "../common";

const components = {
    schemas: {
        purchasePaymentAddInput: {
            type: 'object',
            properties: {
                vendorId: {
                    type: 'integer',
                    description: 'Vendor unique id',
                    example: 1
                },
                amount: {
                    type: 'number',
                    description: 'Payment amount',
                    example: 1500.00
                },
                paymentModeId: {
                    type: 'integer',
                    description: 'Payment mode unique id',
                    example: 1
                },
                paymentDate: {
                    type: 'string',
                    description: 'Payment date (YYYY-MM-DD)',
                    example: '2026-08-20'
                },
                remark: {
                    type: 'string',
                    description: 'Payment remark',
                    example: 'Advance payment for fabric'
                }
            }
        },

        purchasePaymentAddOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['601']
                },
                data: {
                    type: 'object',
                    properties: {
                        'purchase_payment_id': {
                            type: 'integer',
                            example: 1
                        }
                    }
                }
            }
        },

        purchasePaymentUpdateInput: {
            type: 'object',
            properties: {
                purchasePaymentId: {
                    type: 'integer',
                    description: 'Purchase payment unique id',
                    example: 1
                },
                vendorId: {
                    type: 'integer',
                    description: 'Vendor unique id',
                    example: 1
                },
                amount: {
                    type: 'number',
                    description: 'Payment amount',
                    example: 1500.00
                },
                paymentModeId: {
                    type: 'integer',
                    description: 'Payment mode unique id',
                    example: 1
                },
                paymentDate: {
                    type: 'string',
                    description: 'Payment date (YYYY-MM-DD)',
                    example: '2026-08-20'
                },
                remark: {
                    type: 'string',
                    description: 'Payment remark',
                    example: 'Updated payment remark'
                }
            }
        },

        purchasePaymentUpdateOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['602']
                }
            }
        },

        purchasePaymentDeleteOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['603']
                }
            }
        },

        purchasePaymentOutputData: {
            type: 'object',
            properties: {
                'purchase_payment_id': { type: 'integer', example: 1 },
                'vendor_id': { type: 'integer', example: 1 },
                'vendor_name': { type: 'string', example: 'ABC Textiles' },
                'amount': { type: 'number', example: 1500.00 },
                'payment_mode_id': { type: 'integer', example: 1 },
                'payment_mode': { type: 'string', example: 'Bank Transfer' },
                'payment_date': { type: 'string', example: '2026-08-20' },
                'remark': { type: 'string', example: 'Advance payment for fabric' },
                'status': { type: 'string', example: 'ACTIVE' },
                'created_by': { type: 'integer', example: 1 },
                'updated_by': { type: 'integer', example: 1 },
                'creating_date': { type: 'string', example: '2026-08-20 12:00:00' },
                'updation_date': { type: 'string', example: '2026-08-20 12:00:00' }
            }
        },

        purchasePaymentSelectByIdOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['604']
                },
                data: {
                    $ref: '#/components/schemas/purchasePaymentOutputData'
                }
            }
        },

        purchasePaymentSearchInput: {
            type: 'object',
            properties: {
                vendorId: {
                    type: 'integer',
                    description: 'Search by vendor id (0 for all)',
                    example: 0
                },
                search: {
                    type: 'string',
                    description: 'General search keyword',
                    example: ''
                },
                ...common.searchCommonProperties
            }
        },

        purchasePaymentSearchOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['607']
                },
                data: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/purchasePaymentOutputData'
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
                            description: 'Total matching purchase payment records',
                            example: 5
                        }
                    }
                }
            }
        }
    }
};

export default { ...components };

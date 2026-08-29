import response from '../../configs/response';
import { common } from "../common";

const components = {
    schemas: {
        purchaseDetailItemInput: {
            type: 'object',
            properties: {
                purchaseDetailId: {
                    type: 'integer',
                    description: 'Purchase detail unique id (0 for insert, >0 for update)',
                    example: 0
                },
                categoryId: {
                    type: 'integer',
                    description: 'Category unique id',
                    example: 1
                },
                brandId: {
                    type: 'integer',
                    description: 'Brand unique id',
                    example: 1
                },
                colorId: {
                    type: 'integer',
                    description: 'Color unique id',
                    example: 1
                },
                rate: {
                    type: 'number',
                    description: 'Item rate',
                    example: 150.00
                },
                sellingPrice: {
                    type: 'number',
                    description: 'Selling price per meter',
                    example: 250.00
                },
                minimumStockQty: {
                    type: 'number',
                    description: 'Minimum stock quantity in meters',
                    example: 10.00
                },
                meter: {
                    type: 'number',
                    description: 'Quantity in meters',
                    example: 25.5
                },
                cgstId: {
                    type: 'integer',
                    description: 'CGST unique id',
                    example: 1
                },
                sgstId: {
                    type: 'integer',
                    description: 'SGST unique id',
                    example: 1
                },
                igstId: {
                    type: 'integer',
                    description: 'IGST unique id',
                    example: 1
                },
                remark: {
                    type: 'string',
                    description: 'Item remark (optional)',
                    example: 'Premium cotton fabric'
                }
            }
        },

        purchaseAddInput: {
            type: 'object',
            properties: {
                shopId: {
                    type: 'integer',
                    description: 'Shop unique id',
                    example: 1
                },
                vendorId: {
                    type: 'integer',
                    description: 'Vendor unique id',
                    example: 1
                },
                purchaseDate: {
                    type: 'string',
                    description: 'Purchase date (YYYY-MM-DD)',
                    example: '2026-08-14'
                },
                remark: {
                    type: 'string',
                    description: 'Remark / Notes',
                    example: 'Purchase order for fabric'
                },
                roundOffAmount: {
                    type: 'number',
                    description: 'Round off amount',
                    example: 0.00
                },
                detailJson: {
                    type: 'array',
                    description: 'Array of purchase detail items',
                    items: {
                        $ref: '#/components/schemas/purchaseDetailItemInput'
                    }
                }
            }
        },

        purchaseAddOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['481']
                },
                data: {
                    type: 'object',
                    properties: {
                        'purchase_id': {
                            type: 'integer',
                            example: 1
                        },
                        'purchase_no': {
                            type: 'string',
                            example: 'SH/PUR/26-27/0001'
                        }
                    }
                }
            }
        },

        purchaseUpdateInput: {
            type: 'object',
            properties: {
                purchaseId: {
                    type: 'integer',
                    description: 'Purchase unique id',
                    example: 1
                },
                shopId: {
                    type: 'integer',
                    description: 'Shop unique id',
                    example: 1
                },
                vendorId: {
                    type: 'integer',
                    description: 'Vendor unique id',
                    example: 1
                },
                purchaseDate: {
                    type: 'string',
                    description: 'Purchase date (YYYY-MM-DD)',
                    example: '2026-08-14'
                },
                remark: {
                    type: 'string',
                    description: 'Remark / Notes',
                    example: 'Updated purchase remark'
                },
                roundOffAmount: {
                    type: 'number',
                    description: 'Round off amount',
                    example: 0.00
                },
                detailJson: {
                    type: 'array',
                    description: 'Array of purchase detail items (set purchaseDetailId = 0 to insert new detail, or > 0 to update existing detail)',
                    items: {
                        $ref: '#/components/schemas/purchaseDetailItemInput'
                    }
                }
            }
        },

        purchaseUpdateOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['482']
                }
            }
        },

        purchaseDeleteOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['483']
                }
            }
        },

        purchaseOutputData: {
            type: 'object',
            properties: {
                'purchase_id': { type: 'integer', example: 1 },
                'purchase_no': { type: 'string', example: 'SH/PUR/26-27/0001' },
                'shop_id': { type: 'integer', example: 1 },
                'vendor_id': { type: 'integer', example: 1 },
                'vendor_name': { type: 'string', example: 'John Doe Supplier' },
                'purchase_date': { type: 'string', example: '2026-08-14' },
                'remark': { type: 'string', example: 'Purchase order for fabric' },
                'total': { type: 'number', example: 3750.00 },
                'total_gst': { type: 'number', example: 187.50 },
                'total_amount': { type: 'number', example: 3937.50 },
                'round_off_amount': { type: 'number', example: 0.00 },
                'gtotal': { type: 'number', example: 3937.50 },
                'status': { type: 'string', example: 'ACTIVE' },
                'created_by': { type: 'integer', example: 1 },
                'updated_by': { type: 'integer', example: 1 },
                'creating_date': { type: 'string', example: '2026-08-14 10:30:00' },
                'updation_date': { type: 'string', example: '2026-08-14 10:30:00' },
                'detail_json': {
                    type: 'array',
                    items: {
                        type: 'object'
                    }
                }
            }
        },

        purchaseSelectByIdOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['484']
                },
                data: {
                    $ref: '#/components/schemas/purchaseOutputData'
                }
            }
        },

        purchaseSearchInput: {
            type: 'object',
            properties: {
                shopId: {
                    type: 'integer',
                    description: 'Search by shop id',
                    example: 1
                },
                vendorId: {
                    type: 'integer',
                    description: 'Search by vendor id',
                    example: 1
                },
                purchaseNo: {
                    type: 'string',
                    description: 'Search by purchase number',
                    example: 'SH/PUR/26-27/0001'
                },
                purchaseDate: {
                    type: 'string',
                    description: 'Search by exact purchase date',
                    example: '2026-08-14'
                },
                fromDate: {
                    type: 'string',
                    description: 'Search from purchase date',
                    example: '2026-08-01'
                },
                toDate: {
                    type: 'string',
                    description: 'Search to purchase date',
                    example: '2026-08-31'
                },
                ...common.searchCommonProperties
            }
        },

        purchaseSearchOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['487']
                },
                data: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/purchaseOutputData'
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
                            description: 'Total matching purchase records',
                            example: 25
                        }
                    }
                }
            }
        }
    }
};

export default { ...components };

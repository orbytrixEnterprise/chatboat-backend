import response from '../../configs/response';
import { common } from "../common";

const components = {
    schemas: {
        purchaseDetailAddInput: {
            type: 'object',
            properties: {
                purchaseId: {
                    type: 'integer',
                    description: 'Purchase unique id',
                    example: 1
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
                    description: 'Remark / Notes',
                    example: 'Cotton fabric roll'
                }
            }
        },

        purchaseDetailAddOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['501']
                },
                data: {
                    type: 'object',
                    properties: {
                        'purchase_detail_id': {
                            type: 'integer',
                            example: 1
                        },
                        'detail_no': {
                            type: 'string',
                            example: 'SH/FAB/0001'
                        }
                    }
                }
            }
        },

        purchaseDetailUpdateInput: {
            type: 'object',
            properties: {
                purchaseDetailId: {
                    type: 'integer',
                    description: 'Purchase detail unique id',
                    example: 1
                },
                purchaseId: {
                    type: 'integer',
                    description: 'Purchase unique id',
                    example: 1
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
                    description: 'Remark / Notes',
                    example: 'Cotton fabric roll'
                }
            }
        },

        purchaseDetailUpdateOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['502']
                }
            }
        },

        purchaseDetailDeleteOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['503']
                }
            }
        },

        purchaseDetailOutputData: {
            type: 'object',
            properties: {
                'purchase_detail_id': { type: 'integer', example: 1 },
                'purchase_id': { type: 'integer', example: 1 },
                'purchase_no': { type: 'string', example: 'SH/PUR/26-27/0001' },
                'detail_no': { type: 'string', example: 'SH/FAB/0001' },
                'category_id': { type: 'integer', example: 1 },
                'category_name': { type: 'string', example: 'Fabric' },
                'brand_id': { type: 'integer', example: 1 },
                'brand_name': { type: 'string', example: 'Raymond' },
                'color_id': { type: 'integer', example: 1 },
                'color_name': { type: 'string', example: 'Blue' },
                'rate': { type: 'number', example: 150.00 },
                'selling_price': { type: 'number', example: 250.00 },
                'minimum_stock_qty': { type: 'number', example: 10.00 },
                'meter': { type: 'number', example: 25.50 },
                'total': { type: 'number', example: 3825.00 },
                'cgst_id': { type: 'integer', example: 1 },
                'cgst': { type: 'number', example: 2.50 },
                'cgst_amount': { type: 'number', example: 95.63 },
                'sgst_id': { type: 'integer', example: 1 },
                'sgst': { type: 'number', example: 2.50 },
                'sgst_amount': { type: 'number', example: 95.63 },
                'igst_id': { type: 'integer', example: 0 },
                'igst': { type: 'number', example: 0.00 },
                'igst_amount': { type: 'number', example: 0.00 },
                'total_amount': { type: 'number', example: 4016.25 },
                'remark': { type: 'string', example: 'Cotton fabric roll' },
                'status': { type: 'string', example: 'ACTIVE' },
                'created_by': { type: 'integer', example: 1 },
                'updated_by': { type: 'integer', example: 1 },
                'creating_date': { type: 'string', example: '2026-08-14 10:30:00' },
                'updation_date': { type: 'string', example: '2026-08-14 10:30:00' }
            }
        },

        purchaseDetailSelectByIdOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['504']
                },
                data: {
                    $ref: '#/components/schemas/purchaseDetailOutputData'
                }
            }
        },

        purchaseDetailGetOldDetailValueInput: {
            type: 'object',
            properties: {
                shopId: {
                    type: 'integer',
                    description: 'Shop unique id',
                    example: 1
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
                }
            }
        },

        purchaseDetailGetOldDetailValueOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['508']
                },
                data: {
                    $ref: '#/components/schemas/purchaseDetailOutputData'
                }
            }
        },

        purchaseDetailAddUpdateItemImageInput: {
            type: 'object',
            properties: {
                purchaseDetailId: {
                    type: 'integer',
                    description: 'Purchase detail unique id',
                    example: 1
                },
                itemImage: {
                    type: 'string',
                    description: 'Item image path or URL string',
                    example: '/uploads/purchase/item-image-123.jpg'
                }
            }
        },

        purchaseDetailAddUpdateItemImageOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['509']
                }
            }
        },

        purchaseDetailSearchInput: {
            type: 'object',
            properties: {
                shopId: {
                    type: 'integer',
                    description: 'Search by shop id',
                    example: 1
                },
                purchaseId: {
                    type: 'integer',
                    description: 'Search by purchase id',
                    example: 1
                },
                categoryId: {
                    type: 'integer',
                    description: 'Search by category id',
                    example: 1
                },
                brandId: {
                    type: 'integer',
                    description: 'Search by brand id',
                    example: 1
                },
                colorId: {
                    type: 'integer',
                    description: 'Search by color id',
                    example: 1
                },
                detailNo: {
                    type: 'string',
                    description: 'Search by detail number (e.g., SH/FAB/0001)',
                    example: 'SH/FAB/0001'
                },
                ...common.searchCommonProperties
            }
        },

        purchaseDetailSearchOutput: {
            type: 'object',
            properties: {
                status: {
                    type: 'integer',
                    example: 1
                },
                message: {
                    type: 'string',
                    example: response['507']
                },
                data: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/purchaseDetailOutputData'
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
                            description: 'Total matching purchase detail records',
                            example: 15
                        }
                    }
                }
            }
        }
    }
};

export default { ...components };

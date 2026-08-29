export const common = {

    schemas: {
        error: {
            type: "object",
            properties: {
                status: {
                    type: "integer"
                },
                message: {
                    type: "string"
                },
                error: {
                    type: "string"
                }
            }
        }
    },

    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
        }
    },

    searchCommonProperties: {

        search: {
            type: "string",
            description: "Global search keyword",
            example: "abc"
        },
        page: {
            type: "integer",
            description: "Page number",
            example: 1
        },
        noOf: {
            type: "integer",
            description: "Number of records per page",
            example: 10
        },
        filter: {
            type: "array",
            description: "Advanced filter conditions",
            items: {
                type: "object",
                properties: {
                    key: {
                        type: "string",
                        example: "name"
                    },
                    type: {
                        type: "string",
                        example: "contains"
                    },
                    value: {
                        type: "string",
                        example: "abc"
                    }
                }
            }
        },
        orderBy: {
            type: "array",
            description: "Sorting options",
            items: {
                type: "object",
                properties: {
                    key: {
                        type: "string",
                        example: "name"
                    },
                    orderType: {
                        type: "string",
                        example: "asc"
                    }
                }
            }
        }
    }

};

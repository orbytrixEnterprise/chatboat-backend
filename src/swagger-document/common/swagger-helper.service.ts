/****************************
 SWAGGER SERVICE
 ****************************/

interface swaggerParameter {
    name: string;
    in?: "path" | "query" | "header" | "cookie";
    description?: string;
    required?: boolean;
    type?: "string" | "integer" | "number" | "boolean" | "array";
    example?: any;
    enum?: any[];
}

export class SwaggerService {

    /**
     * Bearer Authentication
     */
    static bearerAuth() {

        return [
            {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        ];

    }

    /**
     * Request Body
     */
    static requestBody(schema: string) {

        return {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: `#/components/schemas/${schema}`
                    }
                }
            }
        };

    }

    /**
     * Success Response
     */
    static successResponse(description: string, schema: string) {

        return {
            "200": {
                description,
                content: {
                    "application/json": {
                        schema: {
                            $ref: `#/components/schemas/${schema}`
                        }
                    }
                }
            }
        };

    }

    /**
     * Parameters
     */
    static parameters(parameters: swaggerParameter[]) {

        return parameters.map(parameter => {

            const schema: any = {
                type: parameter.type || "string"
            };

            if (parameter.example !== undefined) {
                schema.example = parameter.example;
            }

            if (parameter.enum) {
                schema.enum = parameter.enum;
            }

            return {
                name: parameter.name,
                in: parameter.in || "query",
                required: parameter.in === "path" ? true : (parameter.required || false),
                description: parameter.description || "",
                schema
            };

        });

    }

}
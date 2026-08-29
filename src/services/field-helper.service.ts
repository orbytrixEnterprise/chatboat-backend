/****************************
 FIELD VALIDATION OPERATIONS
 ****************************/

export class FieldHelperService {

    // Method to check undefined and null
    static undefinedAndNullCheckWithOutBlankValue(name: any) {
        return name !== undefined && name !== null;
    }

    // Method to check undefined and null
    static undefinedAndNullCheck(name: any) {
        return name !== undefined && name !== null && name !== '';
    }



    // Method to check JSON input
    static isValidJson(str: any) {
        try {
            JSON.parse(str);
        } catch (e) {
            console.log(e);
            return false;
        }
        return true;
    }

    static getCurrentDateTime(): string {
        const date = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');

        return (
            date.getFullYear() + '-' +
            pad(date.getMonth() + 1) + '-' +
            pad(date.getDate()) + ' ' +
            pad(date.getHours()) + ':' +
            pad(date.getMinutes()) + ':' +
            pad(date.getSeconds())
        );
    }

    /**
     * Generate query parameters with default values
     */
    static values(body: any, fields: [string, any][]) {
        return fields.map(([key, defaultValue]) => {
            const val = body[key];
            if (this.undefinedAndNullCheck(val)) {
                if (typeof defaultValue === 'string' && typeof val !== 'string' && typeof val !== 'number') {
                    return defaultValue;
                }
                return val;
            }
            return defaultValue;
        });
    }
    
}
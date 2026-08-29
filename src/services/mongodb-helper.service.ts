/* eslint-disable @typescript-eslint/naming-convention */
import { Model } from 'mongoose';

export interface SearchOptions {
    filterFields: Record<string, string>; // SQL field prefix -> Schema field key
    sortFields: Record<string, string>;   // SQL sort col -> Schema sort key
    defaultQuery?: Record<string, any>;   // Default query filters (e.g. status: "ACTIVE")
}

export class MongoHelperService {

    /**
     * Extracts search values, regular expressions, or numbers from legacy SQL strings.
     */
    static extractValueFromSql(sql: string, field: string): any {
        if (!sql) {
            return null;
        }
        // Match LIKE "%value%" or LIKE 'value%'
        const likeRegex = new RegExp(`\`${field}\`\\s+LIKE\\s+["']%?([^%'\u201d\u201c]+)%?["']`, 'i');
        let match = sql.match(likeRegex);
        if (match) {
            return new RegExp(match[1].trim(), 'i');
        }
        // Match exact = "value" or = value
        const eqRegex = new RegExp(`\`${field}\`\\s*=\\s*["']?([^'"\\s\\)]+)["']?`, 'i');
        match = sql.match(eqRegex);
        if (match) {
            const val = match[1].trim();
            if (/^\d+$/.test(val)) {
                return Number(val);
            }
            return new RegExp('^' + val + '$', 'i');
        }
        return null;
    }

    /**
     * General purpose search helper to parse legacy SQL filter/sort inputs and query MongoDB.
     */
    static async search<T>(
        model: Model<T>,
        body: any,
        mapper: (item: any) => any,
        options: SearchOptions
    ): Promise<any[]> {
        const query: any = { ...options.defaultQuery };

        // Parse search/filters from SQL fragments
        for (const [sqlField, schemaField] of Object.entries(options.filterFields)) {
            const extracted = this.extractValueFromSql(body.fieldSearch, sqlField) || 
                              this.extractValueFromSql(body.filter, sqlField);
            if (extracted !== null && extracted !== undefined) {
                query[schemaField] = extracted;
            }
        }

        if (body.action === "COUNT" || body.action === "DEFAULT_SEARCH_COUNT") {
            const count = await model.countDocuments(query);
            return [{ count }];
        } else {
            const page = Number(body.page) || 1;
            const noOf = Number(body.noOf) || 10;

            const sort: any = {};
            if (body.orderBy && body.orderBy.trim().length > 0) {
                const parts = body.orderBy.split(",");
                for (const part of parts) {
                    const [col, dir] = part.trim().split(/\s+/);
                    if (col) {
                        const schemaSortCol = options.sortFields[col] || col;
                        sort[schemaSortCol] = dir?.toUpperCase() === "DESC" ? -1 : 1;
                    }
                }
            } else {
                sort.creatingDate = -1;
            }

            const results = await model.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf)
                .lean();

            return results.map(mapper);
        }
    }
}

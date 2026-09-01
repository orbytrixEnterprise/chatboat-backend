/* eslint-disable @typescript-eslint/naming-convention */
import { Model } from 'mongoose';

export interface SearchOptions {
    filterFields: Record<string, string>; // Request parameter key -> Schema field key
    sortFields: Record<string, string>;   // Sort parameter key -> Schema sort key
    defaultQuery?: Record<string, any>;   // Default query filters (e.g. status: "ACTIVE")
    populate?: string | any;              // Optional populates (string or array)
}

export class MongoHelperService {

    /**
     * General purpose search helper to parse filter/sort inputs and query MongoDB.
     * Works globally for any module.
     */
    static async search<T>(
        model: Model<T>,
        body: any,
        mapper: (item: any) => any,
        options: SearchOptions
    ): Promise<any[]> {
        const query: any = { ...options.defaultQuery };

        // 1. Global text search keyword
        if (body.search && body.search.trim().length > 0) {
            const searchRegex = new RegExp(body.search.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { emailId: searchRegex },
                { mobileNo: searchRegex }
            ];
        }

        // 2. Map standard request filters (e.g. body.name, body.status)
        for (const [paramKey, schemaField] of Object.entries(options.filterFields)) {
            const val = body[paramKey];
            if (val !== undefined && val !== null && String(val).trim().length > 0) {
                if (typeof val === 'string') {
                    query[schemaField] = new RegExp(val.trim(), 'i');
                } else {
                    query[schemaField] = val;
                }
            }
        }

        // 3. Map advanced structured filters (e.g. body.filter grid array)
        if (body.filter && Array.isArray(body.filter)) {
            for (const item of body.filter) {
                const schemaKey = options.filterFields[item.key] || item.key;
                const val = item.value;
                if (val !== undefined && val !== null && String(val).trim().length > 0) {
                    switch (item.type) {
                        case "contains":
                            query[schemaKey] = new RegExp(val.trim(), 'i');
                            break;
                        case "equals":
                            query[schemaKey] = /^\d+$/.test(val) ? Number(val) : new RegExp('^' + val.trim() + '$', 'i');
                            break;
                        case "start with":
                            query[schemaKey] = new RegExp('^' + val.trim(), 'i');
                            break;
                        case "end with":
                            query[schemaKey] = new RegExp(val.trim() + '$', 'i');
                            break;
                        default:
                            query[schemaKey] = val;
                    }
                }
            }
        }

        // 4. Execute query as COUNT or SELECT
        if (body.action === "COUNT" || body.action === "DEFAULT_SEARCH_COUNT") {
            const count = await model.countDocuments(query);
            return [{ count }];
        } else {
            const page = Number(body.page) || 1;
            const noOf = Number(body.noOf) || 10;

            const sort: any = {};
            if (body.orderBy && Array.isArray(body.orderBy)) {
                for (const item of body.orderBy) {
                    const schemaSortCol = options.sortFields[item.key] || item.key;
                    sort[schemaSortCol] = item.orderType === "desc" ? -1 : 1;
                }
            } else {
                sort.creatingDate = -1;
            }

            let queryExec = model.find(query)
                .sort(sort)
                .skip((page - 1) * noOf)
                .limit(noOf);

            if (options.populate) {
                queryExec = queryExec.populate(options.populate);
            }

            const results = await queryExec.lean();

            return results.map(mapper);
        }
    }
}

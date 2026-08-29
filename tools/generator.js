#!/usr/bin/env node
/**
 * ============================================================
 *  SOLVIFY TECH — Module Code Generator
 *  Version: 1.0.0
 *
 *  Usage:
 *    node tools/generator.js
 *
 *  Works with any project that follows the same architecture.
 *  Copy this file to any project's tools/ folder and run it.
 * ============================================================
 */

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

// ─── Helpers ────────────────────────────────────────────────

/** snake_case / kebab-case → camelCase */
function toCamel(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

/** camelCase / PascalCase → kebab-case */
function toKebab(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

/** First letter uppercase */
function toPascal(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** camelCase → Title Case (e.g. templeSlotType → Temple Slot Type) */
function toTitle(str) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, s => s.toUpperCase())
        .trim();
}

/** Find project root by looking for package.json upward */
function findProjectRoot(start) {
    let dir = start;
    while (true) {
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
        const parent = path.dirname(dir);
        if (parent === dir) throw new Error('Cannot find project root (no package.json found)');
        dir = parent;
    }
}

const ROOT = findProjectRoot(__dirname);
const SRC  = path.join(ROOT, 'src');

// ─── SQL Parser ─────────────────────────────────────────────

/**
 * Reads database/work.sql and extracts stored procedures.
 * Supports your exact format:
 *   CREATE DEFINER=`x`@`%` PROCEDURE `spName`(
 *       _param_name TYPE,
 *       _action ENUM('ACTION1','ACTION2',...)
 *   )
 *
 * Returns array of { spName, fields, selectActions, executeActions }
 */
function parseSqlFile() {
    const sqlPath = path.join(ROOT, 'database', 'work.sql');
    if (!fs.existsSync(sqlPath)) return [];

    const content = fs.readFileSync(sqlPath, 'utf8');
    const results  = [];

    // Match full procedure signature including DEFINER clause
    // Captures: spName, full param block between outer ( )
    const procRe = /CREATE\s+(?:DEFINER\s*=\s*`[^`]*`@`[^`]*`\s+)?PROCEDURE\s+`?(\w+)`?\s*\(([\s\S]*?)\)\s*BEGIN/gi;

    let match;
    while ((match = procRe.exec(content)) !== null) {
        const spName     = match[1];
        const paramBlock = match[2];
        const fields     = [];
        let   actionEnumValues = [];

        // Split param block by lines to parse each parameter
        // Each param line looks like:  _param_name TYPE_DEFINITION,
        // TYPE_DEFINITION can be:
        //   INT, VARCHAR(200), DECIMAL(10,2), JSON, TINYINT
        //   ENUM('VAL1','VAL2',...)   ← multi-value, may span line
        const lines = paramBlock.split('\n');

        // Re-join the block cleanly to handle ENUM spanning lines
        const cleanBlock = paramBlock.replace(/\s+/g, ' ').trim();

        // Match each parameter: _name followed by type (including ENUM(...))
        // Pattern: _identifier WHITESPACE TYPE where TYPE ends at comma or end
        const paramRe = /`?(_\w+)`?\s+(ENUM\s*\([^)]+\)|[\w]+(?:\s*\(\s*[\d,\s]+\s*\))?)/gi;
        let pm;
        while ((pm = paramRe.exec(cleanBlock)) !== null) {
            const rawName = pm[1]; // e.g. _temple_id
            const rawType = pm[2]; // e.g. INT, VARCHAR(200), ENUM('A','B')

            // Strip leading underscore(s) and convert to camelCase
            const stripped = rawName.replace(/^_+/, '');
            const camel    = toCamel(stripped);

            // Detect ENUM type and extract values
            const isEnum   = /^ENUM/i.test(rawType);
            const sqlType  = isEnum ? 'ENUM' : rawType.split('(')[0].toUpperCase();

            // If this is _action, extract ENUM values for smart switch generation
            if (camel === 'action' && isEnum) {
                const valMatch = rawType.match(/ENUM\s*\(([^)]+)\)/i);
                if (valMatch) {
                    actionEnumValues = valMatch[1]
                        .split(',')
                        .map(v => v.trim().replace(/['"]/g, ''))
                        .filter(Boolean);
                }
            }

            const defVal = guessDefault(sqlType, camel);
            fields.push({ name: camel, sqlType, rawType, default: defVal });
        }

        if (fields.length > 0) {
            // Split action ENUM values into select vs execute categories
            // SELECT actions = those that return result sets
            const selectKeywords  = ['CHECK', 'SELECTBYID', 'SELECTBYDATE', 'SELECTBYMONTH',
                                     'SELECT', 'VALIDATE', 'VERIFY', 'SELECT_BY_CODE',
                                     'GENERATE_DEFAULT_TEMPLATE', 'PENDING'];
            const selectActions   = actionEnumValues.filter(a =>
                selectKeywords.some(k => a.toUpperCase().includes(k))
            );
            const executeActions  = actionEnumValues.filter(a => !selectActions.includes(a));

            results.push({ spName, fields, actionEnumValues, selectActions, executeActions });
        }
    }

    return results;
}

/** Guess a sensible default value based on SQL type and field name */
function guessDefault(sqlType, fieldName) {
    const name = fieldName.toLowerCase();
    if (name === 'action') return '""';
    if (name.endsWith('id') && name !== 'id') return '0';
    if (name === 'status') return '"ACTIVE"';
    if (name.includes('date') && !name.includes('update')) return 'moment().format("YYYY-MM-DD")';
    if ((name.includes('time') || name.includes('from_time') || name.includes('to_time')) && !name.includes('timeout')) return '""';
    if (name.includes('json') || name === 'jsondata' || sqlType === 'JSON') return '"[]"';
    if (name.includes('data') && sqlType === 'JSON') return '"[]"';
    if (sqlType === 'ENUM') return '""';
    const numericTypes = ['INT','BIGINT','TINYINT','SMALLINT','MEDIUMINT','DECIMAL','FLOAT','DOUBLE','NUMERIC'];
    if (numericTypes.some(t => sqlType.startsWith(t))) return '0';
    return '""';
}

// ─── Response Code Helper ───────────────────────────────────

/** Read response.json and find next free block of 20 */
function findNextResponseBlock() {
    const rPath = path.join(SRC, 'configs', 'response.json');
    if (!fs.existsSync(rPath)) return 521;
    const data  = JSON.parse(fs.readFileSync(rPath, 'utf8'));
    const codes = Object.keys(data).map(k => parseInt(k.split('_')[0])).filter(n => !isNaN(n));
    const maxCode = Math.max(...codes);
    // Round up to nearest 20-block start
    const blockStart = Math.ceil((maxCode + 1) / 20) * 20 + 1;
    return blockStart;
}

/** Check if a response block starting at N is fully free */
function isBlockFree(start) {
    const rPath = path.join(SRC, 'configs', 'response.json');
    if (!fs.existsSync(rPath)) return true;
    const data  = JSON.parse(fs.readFileSync(rPath, 'utf8'));
    for (let i = 0; i < 20; i++) {
        if (data[String(start + i)]) return false;
    }
    return true;
}

// ─── Interactive Prompt ─────────────────────────────────────

function prompt(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function askConfig() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║        SOLVIFY TECH — Module Generator           ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    // ── Scenario
    console.log('Scenario:');
    console.log('  1 → Create whole new module');
    console.log('  2 → Add new APIs to existing module');
    console.log('  3 → Remove an API from a module');
    const scenarioRaw = await prompt(rl, '\nEnter scenario (1/2/3): ');
    const scenario = scenarioRaw.trim();

    // ── Module name
    const moduleRaw = await prompt(rl, 'Module name (e.g. Donation, TempleGate): ');
    const modulePascal = toPascal(moduleRaw.trim()); // e.g. Donation
    const moduleCamel  = modulePascal.charAt(0).toLowerCase() + modulePascal.slice(1); // donation
    const moduleKebab  = toKebab(modulePascal); // donation or temple-gate
    const moduleTitle  = toTitle(moduleCamel);   // Donation or Temple Gate

    // ── SP detection from work.sql
    const sqlSPs = parseSqlFile();
    let crudFields   = null;
    let searchFields = null;
    let spName       = moduleCamel;
    let spSearchName = moduleCamel + 'Search';
    let parsedCrudSP   = null;
    let parsedSearchSP = null;

    if (sqlSPs.length > 0) {
        console.log('\n📄 Found these SPs in database/work.sql:');
        sqlSPs.forEach((sp, i) => {
            const actionInfo = sp.actionEnumValues.length > 0
                ? ` → actions: ${sp.actionEnumValues.join(', ')}`
                : '';
            console.log(`  ${i + 1}. ${sp.spName} (${sp.fields.length} params${actionInfo})`);
        });

        const useSql = await prompt(rl, '\nAuto-read SP fields from work.sql? (y/n): ');
        if (useSql.trim().toLowerCase() === 'y') {
            // Try to auto-match by module name
            const crudMatch   = sqlSPs.find(s => s.spName.toLowerCase() === moduleCamel.toLowerCase());
            const searchMatch = sqlSPs.find(s => s.spName.toLowerCase() === (moduleCamel + 'search').toLowerCase());

            if (crudMatch) {
                crudFields    = crudMatch.fields;
                spName        = crudMatch.spName;
                parsedCrudSP  = crudMatch;
                console.log(`  ✅ CRUD SP matched: ${spName}`);
                console.log(`     Fields: ${crudFields.map(f => f.name).join(', ')}`);
                if (crudMatch.selectActions.length > 0)
                    console.log(`     SELECT actions: ${crudMatch.selectActions.join(', ')}`);
                if (crudMatch.executeActions.length > 0)
                    console.log(`     EXECUTE actions: ${crudMatch.executeActions.join(', ')}`);
            } else {
                const idx = await prompt(rl, `  CRUD SP not auto-matched. Enter number from list above (or skip): `);
                if (idx.trim() && sqlSPs[parseInt(idx.trim()) - 1]) {
                    parsedCrudSP = sqlSPs[parseInt(idx.trim()) - 1];
                    crudFields   = parsedCrudSP.fields;
                    spName       = parsedCrudSP.spName;
                }
            }

            if (searchMatch) {
                searchFields   = searchMatch.fields;
                spSearchName   = searchMatch.spName;
                parsedSearchSP = searchMatch;
                console.log(`  ✅ Search SP matched: ${spSearchName}`);
            } else {
                const idx = await prompt(rl, `  Search SP not auto-matched. Enter number (or skip): `);
                if (idx.trim() && sqlSPs[parseInt(idx.trim()) - 1]) {
                    parsedSearchSP = sqlSPs[parseInt(idx.trim()) - 1];
                    searchFields   = parsedSearchSP.fields;
                    spSearchName   = parsedSearchSP.spName;
                }
            }
        }
    }

    // ── Which APIs to generate
    console.log('\nAPIs to generate (comma separated):');
    console.log('  Options: add, update, status, delete, selectById, search');
    console.log('  Example: add,update,status,selectById,search');
    const apisRaw = await prompt(rl, 'APIs: ');
    const apis = apisRaw.split(',').map(a => a.trim().toLowerCase()).filter(Boolean);

    // ── Controller method steps (SP calls per method)
    const methodSteps = {};
    const availableSPs = sqlSPs.length > 0
        ? sqlSPs.map(s => s.spName)
        : [spName, spSearchName];

    console.log('\n─────────────────────────────────────────────────────');
    console.log('  Controller Step Builder');
    console.log('  For each method, define the SP calls in order.');
    console.log(`  Available SPs: ${availableSPs.join(', ')}`);
    console.log('─────────────────────────────────────────────────────');

    for (const api of apis) {
        if (api === 'search') continue; // search is always fixed pattern

        console.log(`\n  Method: ${api}()`);

        const countRaw = await prompt(rl, `    How many SP calls inside ${api}()? : `);
        const count = Math.max(1, parseInt(countRaw.trim()) || 1);

        const steps = [];
        for (let i = 1; i <= count; i++) {
            console.log(`\n    Call ${i} of ${count}:`);

            // Which SP
            let spChoice = spName;
            if (availableSPs.length > 1) {
                console.log(`      SPs: ${availableSPs.map((s, idx) => `${idx+1}.${s}`).join('  ')}`);
                const spIdx = await prompt(rl, `      Which SP? (number or name) [default: ${spName}]: `);
                const trimmed = spIdx.trim();
                if (trimmed) {
                    const asNum = parseInt(trimmed);
                    spChoice = (!isNaN(asNum) && availableSPs[asNum-1])
                        ? availableSPs[asNum-1]
                        : (trimmed || spName);
                }
            }

            // Find the parsed SP for action list
            const matchedSP = sqlSPs.find(s => s.spName === spChoice);
            const actionList = matchedSP ? matchedSP.actionEnumValues : [];

            if (actionList.length > 0) {
                console.log(`      Actions in ${spChoice}: ${actionList.join(', ')}`);
            }

            const actionRaw = await prompt(rl, `      Action to call: `);
            const action = actionRaw.trim().toUpperCase();

            // Is this a check/select (returns rows) or execute (void)?
            const isSelectKeyword = ['CHECK','SELECTBYID','SELECTBYDATE','SELECT','VALIDATE','VERIFY','PENDING','GENERATE'].some(k => action.includes(k));
            const checkTypeRaw = await prompt(rl, `      Result type? (1=check rows.length  2=check result[0].status  3=void/no check) [default ${isSelectKeyword ? '1' : '3'}]: `);
            const checkType = checkTypeRaw.trim() || (isSelectKeyword ? '1' : '3');

            steps.push({ sp: spChoice, action, checkType });
        }

        methodSteps[api] = steps;
    }

    // ── Auth guard
    console.log('\nAuth guard:');
    console.log('  1 → isAuthorized (any logged-in user)');
    console.log('  2 → isAdminAuthorized (admin only)');
    console.log('  3 → isSuperAdminAuthorized (super admin only)');
    const authRaw = await prompt(rl, 'Auth guard (1/2/3) [default 2]: ');
    const authMap = { '1': 'isAuthorized', '2': 'isAdminAuthorized', '3': 'isSuperAdminAuthorized' };
    const authGuard = authMap[authRaw.trim()] || 'isAdminAuthorized';

    // ── checkUserActive
    const cuaRaw = await prompt(rl, 'Include checkUserActive middleware? (y/n) [default y]: ');
    const checkUserActive = cuaRaw.trim().toLowerCase() !== 'n';

    // ── Response code block
    const autoBlock = findNextResponseBlock();
    const rcRaw = await prompt(rl, `Response code start [auto-detected: ${autoBlock}] (press Enter to accept): `);
    const responseCodeStart = parseInt(rcRaw.trim()) || autoBlock;

    rl.close();

    return {
        scenario, modulePascal, moduleCamel, moduleKebab, moduleTitle,
        spName, spSearchName, crudFields, searchFields,
        parsedCrudSP, parsedSearchSP,
        apis, methodSteps,
        authGuard, checkUserActive, responseCodeStart
    };
}

// ─── Response Code Map ──────────────────────────────────────

/**
 * Standard response code layout (offset from start):
 *  +0  = add success
 *  +1  = update success
 *  +2  = status/delete success  (+2_deactive for deactivate)
 *  +3  = selectById / fetch success
 *  +4  = not found
 *  +5  = already exists / duplicate
 *  +6  = search / list fetched
 */
function buildResponseCodes(base, apis, modulePascal) {
    const m = modulePascal;
    const codes = {};
    const n = base;

    codes[n + 0] = `${m} added successfully.`;
    codes[n + 1] = `${m} updated successfully.`;
    if (apis.includes('status')) {
        codes[n + 2] = `${m} activated successfully.`;
        codes[`${n + 2}_deactive`] = `${m} deactivated successfully.`;
    } else if (apis.includes('delete')) {
        codes[n + 2] = `${m} deleted successfully.`;
    }
    codes[n + 3] = `${m} details fetched successfully.`;
    codes[n + 4] = `${m} not found.`;
    codes[n + 5] = `${m} already exists.`;
    codes[n + 6] = `${m} list fetched successfully.`;

    return codes;
}

// ─── File Generators ────────────────────────────────────────

function genModel(cfg) {
    const { modulePascal, moduleCamel, spName, spSearchName, crudFields, searchFields, parsedCrudSP, parsedSearchSP } = cfg;
    const needsMoment = crudFields && crudFields.some(f => f.default.includes('moment'));

    const fields = crudFields && crudFields.length > 0
        ? crudFields
        : [
            { name: `${moduleCamel}Id`, default: '0' },
            { name: 'templeId',           default: '0' },
            { name: 'status',             default: '"ACTIVE"' },
            { name: 'createdUpdatedBy',   default: '0' },
            { name: 'action',             default: '""' }
          ];

    // Use parsed action ENUM values if available for smart switch, else use defaults
    const selectCases = parsedCrudSP && parsedCrudSP.selectActions.length > 0
        ? parsedCrudSP.selectActions.map(a => `            case "${a}":`).join('\n')
        : ['SELECTBYID', 'CHECK'].map(c => `            case "${c}":`).join('\n');

    const searchFieldList = searchFields && searchFields.length > 0
        ? searchFields
        : [
            { name: 'fieldSearch', default: '""' },
            { name: 'search',      default: '""' },
            { name: 'filter',      default: '""' },
            { name: 'orderBy',     default: '""' },
            { name: 'page',        default: '1'  },
            { name: 'noOf',        default: '10' },
            { name: 'action',      default: '"SELECT"' }
          ];

    const paramLines = fields.map(f => `                ["${f.name}", ${f.default}],`).join('\n');
    const searchParamLines = searchFieldList.map(f => `                ["${f.name}", ${f.default}],`).join('\n');

    return `${needsMoment ? 'import moment from "moment";\n' : ''}import { FieldHelperService, MysqlHelperService } from "../../services";

export class ${modulePascal}Model {

    private static readonly modelName = "${modulePascal}Model";

    /**
     * ${modulePascal} Stored Procedure
     */
    async ${moduleCamel}(body: any) {

        const logger = \`\${${modulePascal}Model.modelName}.${moduleCamel}\`;

        const queryParameter = FieldHelperService.values(
            body,
            [
${paramLines}
            ]
        );

        const query = MysqlHelperService.procedure("${spName}", queryParameter);

        switch (body.action) {

${selectCases}
                return MysqlHelperService.select( logger, body, query, queryParameter );

            default:
                return MysqlHelperService.execute( logger, body, query, queryParameter );

        }

    }

    /**
     * ${modulePascal} Search Stored Procedure
     */
    async ${moduleCamel}Search(body: any) {

        const logger = \`\${${modulePascal}Model.modelName}.${moduleCamel}Search\`;

        const queryParameter = FieldHelperService.values(
            body,
            [
${searchParamLines}
            ]
        );

        const query = MysqlHelperService.procedure("${spSearchName}", queryParameter);

        return MysqlHelperService.select( logger, body, query, queryParameter );

    }

}
`;
}

function genController(cfg) {
    const { modulePascal, moduleCamel, apis, methodSteps, responseCodeStart: n } = cfg;
    const P = modulePascal;
    const c = moduleCamel;

    // ── Collect all model classes used across all steps
    const usedModels = new Set();
    apis.forEach(api => {
        const steps = methodSteps[api] || [];
        steps.forEach(s => {
            // Convert spName to ModelClass: templeSlotTemplate → TempleSlotTemplateModel
            const modelClass = toPascal(s.sp) + 'Model';
            usedModels.add(modelClass);
        });
    });
    // Always include own model for search
    usedModels.add(`${P}Model`);
    const modelImports = Array.from(usedModels).join(', ');

    // ── Step code builder
    function buildStepCode(steps, methodName) {
        if (!steps || steps.length === 0) {
            // fallback if user skipped step builder
            return `            // TODO: implement ${methodName} steps\n`;
        }

        let code = '';
        const usedVarNames = new Set();

        steps.forEach((step, i) => {
            const modelClass = toPascal(step.sp) + 'Model';
            const methodCall = step.sp; // e.g. templeSlotTemplate

            // Generate a unique variable name for the result
            let varName;
            const actionLower = step.action.toLowerCase().replace(/_/g, '');
            const candidate   = actionLower === 'insert' || actionLower === 'update' || actionLower === 'status' || actionLower === 'delete'
                ? 'result'
                : actionLower + 'Data';
            varName = usedVarNames.has(candidate) ? candidate + (i + 1) : candidate;
            usedVarNames.add(varName);

            code += `            body.action = "${step.action}";\n\n`;

            if (step.checkType === '3') {
                // void — no result check
                code += `            await new ${modelClass}().${methodCall}(body);\n\n`;
            } else {
                // has result
                code += `            const ${varName}: any = await new ${modelClass}().${methodCall}(body);\n\n`;

                if (step.checkType === '1') {
                    // check rows.length — this is a guard (SELECTBYID / CHECK)
                    const isCheck = step.action.toUpperCase().includes('CHECK');
                    if (isCheck) {
                        code += `            if (${varName}.length > 0) {\n                return this.res.status(200).send({ status: 0, message: response["${n + 5}"] });\n            }\n\n`;
                    } else {
                        code += `            if (${varName}.length === 0) {\n                return this.res.status(200).send({ status: 0, message: response["${n + 4}"] });\n            }\n\n`;
                    }
                } else if (step.checkType === '2') {
                    // check result[0].status (SP-controlled response)
                    code += `            if (${varName}[0].status === 0) {\n                return this.res.status(200).send({ status: 0, message: ${varName}[0].message });\n            }\n\n`;
                }
            }
        });

        return code;
    }

    // ── Success response per method
    const successMsg = {
        add:        `response["${n + 0}"]`,
        update:     `response["${n + 1}"]`,
        status:     `body.status === "ACTIVE" ? response["${n + 2}"] : response["${n + 2}_deactive"]`,
        delete:     `response["${n + 2}"]`,
        selectbyid: `response["${n + 3}"]`,
        selectById: `response["${n + 3}"]`,
    };

    // ── Body source per method
    const bodySource = {
        delete:     'this.req.params',
        selectbyid: 'this.req.params',
        selectById: 'this.req.params',
    };

    let methods = '';

    apis.forEach(api => {

        if (api === 'search') {
            methods += `
    /**
     * Search ${P}
     */
    async search() {
        try {

            const body = this.req.body;
            body.templeId = await Global.getTokenValue(this.req, "templeId");

            let fieldSearch = "";

            if (FieldHelperService.undefinedAndNullCheck(body.templeId) && body.templeId > 0) {
                fieldSearch += (fieldSearch.length > 0 ? " AND " : "") + '(\`tbl\`.\`temple_id\` = ' + body.templeId + ')';
            }

            // TODO: add more fieldSearch conditions based on your SP result columns

            body.fieldSearch = fieldSearch;

            let filter = "";

            for (const key in (body.filter || [])) {
                const element = body.filter[key];
                filter += (filter.length > 0 ? " AND " : "");
                // TODO: add FilterService.addFilterValue cases here
            }

            body.filter = filter;

            let orderBy = "";

            for (const key in (body.orderBy || [])) {
                const element = body.orderBy[key];
                orderBy += (orderBy.length > 0 ? ", " : "") + element.key + " " + (element.orderType === "asc" ? "ASC" : "DESC");
            }

            body.orderBy = orderBy;

            body.action = "COUNT";

            const countData: any = await new ${P}Model().${c}Search(body);

            if (countData && countData.length > 0 && countData[0].count > 0) {

                const data: any = {
                    data: [],
                    page: body.page,
                    noOf: body.noOf,
                    total: countData[0].count
                };

                body.action = "SELECT";

                data.data = await new ${P}Model().${c}Search(body);

                return this.res.status(200).send({ status: 1, message: response["${n + 6}"], data });

            } else {

                return this.res.status(200).send({ status: 1, message: response["102"], data: { data: [], page: body.page, noOf: body.noOf, total: 0 } });

            }

        } catch (err: any) {

            applicationLogger.error(\`${P}Controller search\`, {
                authorization: this.req.headers.authorization,
                body: this.req.body,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["101"], error: err.toString() });

        }
    }
`;
            return;
        }

        if (api === 'selectbyid' || api === 'selectById') {
            methods += `
    /**
     * Select ${P} By Id
     */
    async selectById() {
        try {

            const body = this.req.params;
            body.action = "SELECTBYID";
            body.templeId = await Global.getTokenValue(this.req, "templeId");

            const data: any = await new ${P}Model().${c}(body);

            if (data.length > 0) {
                return this.res.status(200).send({ status: 1, message: response["${n + 3}"], data: data[0] });
            } else {
                return this.res.status(200).send({ status: 0, message: response["${n + 4}"] });
            }

        } catch (err: any) {

            applicationLogger.error(\`${P}Controller selectById\`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });

        }
    }
`;
            return;
        }

        const steps     = methodSteps[api] || [];
        const src       = bodySource[api] || 'this.req.body';
        const stepCode  = buildStepCode(steps, api);
        const successR  = successMsg[api] || `response["${n + 0}"]`;
        const methodName = toPascal(api);

        // Status has special success response with if/else wrapper
        const successBlock = api === 'status'
            ? `                return this.res.status(200).send({ status: 1, message: ${successR} });\n\n            } else {\n\n                return this.res.status(200).send({ status: 0, message: response["${n + 4}"] });\n\n            }`
            : `            return this.res.status(200).send({ status: 1, message: ${successR} });`;

        // For status, wrap last execute in if(data.length > 0)
        const needsIfWrapper = api === 'status';

        let bodySetup = `            const body = ${src};\n`;
        if (src === 'this.req.body') {
            bodySetup += `            body.templeId = await Global.getTokenValue(this.req, "templeId");\n`;
            bodySetup += `            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");\n`;
        } else {
            bodySetup += `            body.createdUpdatedBy = await Global.getTokenValue(this.req, "id");\n`;
        }

        if (needsIfWrapper) {
            // Status: split steps — guards first, then the SELECTBYID check wraps remaining
            // We keep the standard if/else structure
            methods += `
    /**
     * ${methodName} ${P}
     */
    async ${api}() {
        try {

${bodySetup}
${stepCode}
${successBlock}

        } catch (err: any) {

            applicationLogger.error(\`${P}Controller ${api}\`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });

        }
    }
`;
        } else {
            methods += `
    /**
     * ${methodName} ${P}
     */
    async ${api}() {
        try {

${bodySetup}
${stepCode}
            return this.res.status(200).send({ status: 1, message: ${successR} });

        } catch (err: any) {

            applicationLogger.error(\`${P}Controller ${api}\`, {
                body: this.req.body,
                authorization: this.req.headers.authorization,
                error: err.toString()
            });

            return this.res.status(500).send({ status: 0, message: response["100"], error: err.toString() });

        }
    }
`;
        }
    });

    return `import { Controller } from "./controller";
import response from "../../configs/response.json";
import { applicationLogger, Global } from "../../configs";
import { ${modelImports} } from "../model";
import { FieldHelperService, FilterService } from "../../services";

export class ${P}Controller extends Controller {

    constructor() {
        super();
    }
${methods}
}
`;
}

function genSchema(cfg) {
    const { modulePascal, moduleCamel, apis, crudFields } = cfg;
    const P = modulePascal;
    const c = moduleCamel;
    const idField  = `${c}Id`;
    const idLabel  = toTitle(idField);

    // Build field list from SP if available, else minimal defaults
    const bodyFields = crudFields
        ? crudFields.filter(f => !['action','createdUpdatedBy','templeId'].includes(f.name))
        : [];

    function joiForField(f) {
        const n = f.name.toLowerCase();
        if (n.endsWith('id') && n !== 'id') {
            return `joi.number().integer().positive().required().messages({\n            "any.required": \`${toTitle(f.name)} is required.\`,\n            "number.base": \`${toTitle(f.name)} must be a number.\`,\n            "number.positive": \`${toTitle(f.name)} must be a positive number.\`\n        })`;
        }
        if (n === 'status') {
            return `joi.string().valid("ACTIVE", "DEACTIVE").required().messages({\n            "any.required": \`Status is required.\`,\n            "any.only": \`Status must be ACTIVE or DEACTIVE.\`\n        })`;
        }
        return `joi.string().trim().max(255).required().messages({\n            "string.empty": \`${toTitle(f.name)} is required.\`,\n            "any.required": \`${toTitle(f.name)} is required.\`\n        })`;
    }

    function schemaFields(fields) {
        return fields.map(f => `        ${f.name}: ${joiForField(f)}`).join(',\n\n');
    }

    const addFields   = bodyFields.filter(f => f.name !== idField);
    const updateFields = [{ name: idField, sqlType: 'INT', default: '0' }, ...addFields];

    let schemas = `export const ${c}Schema = {\n\n`;

    if (apis.includes('add')) {
        schemas += `    AddSchema: joi.object({\n\n${schemaFields(addFields)}\n\n    }),\n\n`;
    }

    if (apis.includes('update')) {
        schemas += `    UpdateSchema: joi.object({\n\n${schemaFields(updateFields)}\n\n    }),\n\n`;
    }

    if (apis.includes('status')) {
        schemas += `    StatusSchema: joi.object({\n\n        ${idField}: joi.number().integer().positive().required().messages({\n            "any.required": \`${idLabel} is required.\`,\n            "number.base": \`${idLabel} must be a number.\`,\n            "number.positive": \`${idLabel} must be a positive number.\`\n        }),\n\n        status: joi.string().valid("ACTIVE", "DEACTIVE").required().messages({\n            "any.required": \`Status is required.\`,\n            "any.only": \`Status must be ACTIVE or DEACTIVE.\`\n        })\n\n    }),\n\n`;
    }

    if (apis.includes('delete')) {
        schemas += `    DeleteSchema: joi.object({\n\n        ${idField}: joi.number().integer().positive().required().messages({\n            "any.required": \`${idLabel} is required.\`,\n            "number.base": \`${idLabel} must be a number.\`,\n            "number.positive": \`${idLabel} must be a positive number.\`\n        })\n\n    }),\n\n`;
    }

    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        schemas += `    SelectByIdSchema: joi.object({\n\n        ${idField}: joi.number().integer().positive().required().messages({\n            "any.required": \`${idLabel} is required.\`,\n            "number.base": \`${idLabel} must be a number.\`,\n            "number.positive": \`${idLabel} must be a positive number.\`\n        })\n\n    }),\n\n`;
    }

    if (apis.includes('search')) {
        schemas += `    SearchSchema: joi.object({\n\n        search: joi.string().trim().allow("").required().messages({\n            "any.required": \`Search is required.\`\n        }),\n\n        page: joi.number().integer().positive().required().messages({\n            "any.required": \`Page is required.\`,\n            "number.base": \`Page must be a number.\`,\n            "number.positive": \`Page must be a positive number.\`\n        }),\n\n        noOf: joi.number().integer().positive().required().messages({\n            "any.required": \`No of is required.\`,\n            "number.base": \`No of must be a number.\`,\n            "number.positive": \`No of must be a positive number.\`\n        }),\n\n        filter: joi.array().items(\n            joi.object({\n                key: joi.string().trim().required().messages({\n                    "string.empty": \`Key is required.\`,\n                    "any.required": \`Key is required.\`\n                }),\n                type: joi.string().trim().valid("contains", "equals", "start with", "end with").required().messages({\n                    "any.required": \`Type is required.\`,\n                    "any.only": \`Type must be one of 'contains', 'equals', 'start with' or 'end with'.\`\n                }),\n                value: joi.string().trim().required().messages({\n                    "string.empty": \`Value is required.\`,\n                    "any.required": \`Value is required.\`\n                })\n            })\n        ).default([]),\n\n        orderBy: joi.array().items(\n            joi.object({\n                key: joi.string().trim().required().messages({\n                    "string.empty": \`Key is required.\`,\n                    "any.required": \`Key is required.\`\n                }),\n                orderType: joi.string().trim().valid("asc", "desc").required().messages({\n                    "any.required": \`Order type is required.\`,\n                    "any.only": \`Order type must be one of Ascending or Descending.\`\n                })\n            })\n        ).default([])\n\n    })\n\n`;
    }

    schemas += `};\n`;

    // Sanitize functions
    let sanitize = '';

    function sanitizeFn(fnSuffix, fieldsArr, source = 'body') {
        const fieldList = fieldsArr.map(f => `        "${f.name}"`).join(',\n');
        return `\n/**\n * ${fnSuffix} ${P}\n */\nexport const ${fnSuffix.charAt(0).toLowerCase() + fnSuffix.slice(1)}${P}Sanitize = async (req: any, res: any, next: any) => {\n\n    const fieldsToSanitize = [\n${fieldList}\n    ];\n\n    for (const field of fieldsToSanitize) {\n        if (FieldHelperService.undefinedAndNullCheck(req.${source}[field])) {\n            req.${source}[field] = decode(req.sanitize(req.${source}[field] + ""));\n        }\n    }\n\n    next();\n\n};\n`;
    }

    if (apis.includes('add'))    sanitize += sanitizeFn('add',    addFields);
    if (apis.includes('update')) sanitize += sanitizeFn('update', updateFields);
    if (apis.includes('status')) sanitize += sanitizeFn('status', [{ name: idField }, { name: 'status' }]);
    if (apis.includes('delete')) sanitize += sanitizeFn('delete', [{ name: idField }], 'params');
    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        sanitize += `\n/**\n * Select ${P} By Id\n */\nexport const selectBy${P}IdSanitize = (req: any, res: any, next: any) => {\n\n    if (FieldHelperService.undefinedAndNullCheck(req.params.${idField})) {\n        req.params.${idField} = decode(req.sanitize(req.params.${idField}));\n    }\n\n    next();\n\n};\n`;
    }
    if (apis.includes('search')) sanitize += sanitizeFn('search', [{ name: 'search' }, { name: 'page' }, { name: 'noOf' }]);

    return `import joi from "joi";\nimport { decode } from "html-entities";\nimport { FieldHelperService } from "../../services/field-helper.service";\n\n${schemas}${sanitize}`;
}

function genRoute(cfg) {
    const { modulePascal, moduleCamel, moduleKebab, apis, authGuard, checkUserActive } = cfg;
    const P = modulePascal;
    const c = moduleCamel;
    const idField = `${c}Id`;

    // Build schema imports
    const schemaImports = [];
    const sanitizeImports = [];
    if (apis.includes('add'))    { schemaImports.push(`    ${c}Schema.AddSchema`);    sanitizeImports.push(`    add${P}Sanitize`); }
    if (apis.includes('update')) { schemaImports.push(`    ${c}Schema.UpdateSchema`); sanitizeImports.push(`    update${P}Sanitize`); }
    if (apis.includes('status')) { schemaImports.push(`    ${c}Schema.StatusSchema`); sanitizeImports.push(`    status${P}Sanitize`); }
    if (apis.includes('delete')) { schemaImports.push(`    ${c}Schema.DeleteSchema`); sanitizeImports.push(`    delete${P}Sanitize`); }
    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        schemaImports.push(`    ${c}Schema.SelectByIdSchema`);
        sanitizeImports.push(`    selectBy${P}IdSanitize`);
    }
    if (apis.includes('search')) { schemaImports.push(`    ${c}Schema.SearchSchema`); sanitizeImports.push(`    search${P}Sanitize`); }

    const cua = checkUserActive ? ' checkUserActive,' : '';

    function mw(sanitizeFn, schemaName, source = '"body"') {
        return `[ Global.${authGuard},${cua} ${sanitizeFn}, middleware(${c}Schema.${schemaName}, ${source}) ]`;
    }

    let routes = '';

    if (apis.includes('add')) {
        routes += `\n    router.post( routerPath + "Add", ${mw(`add${P}Sanitize`, 'AddSchema')}, (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.add();\n    });\n`;
    }
    if (apis.includes('update')) {
        routes += `\n    router.put( routerPath + "Update", ${mw(`update${P}Sanitize`, 'UpdateSchema')}, (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.update();\n    });\n`;
    }
    if (apis.includes('status')) {
        routes += `\n    router.put( routerPath + "Status", ${mw(`status${P}Sanitize`, 'StatusSchema')}, (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.status();\n    });\n`;
    }
    if (apis.includes('delete')) {
        routes += `\n    router.delete( routerPath + "Delete/:${idField}", ${mw(`delete${P}Sanitize`, 'DeleteSchema', '"params"')}, (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.delete();\n    });\n`;
    }
    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        routes += `\n    router.get( routerPath + "SelectById/:${idField}", [ Global.${authGuard}, selectBy${P}IdSanitize, middleware(${c}Schema.SelectByIdSchema, "params") ], (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.selectById();\n    });\n`;
    }
    if (apis.includes('search')) {
        routes += `\n    router.post( routerPath + "Search", ${mw(`search${P}Sanitize`, 'SearchSchema')}, (req: any, res: any) => {\n        const task = (new ${P}Controller()).boot(req, res);\n        return task.search();\n    });\n`;
    }

    return `import { ${checkUserActive ? 'checkUserActive, ' : ''}configuration, Global, middleware } from "../../configs";
import { ${P}Controller } from "../controller";
import {
    ${c}Schema,
${sanitizeImports.join(',\n')}
} from "../schema";

const ${c}Route = function (app: any, express: any) {

    const router = express.Router();
    const routerPath = "/${P}/";
${routes}
    app.use(configuration.baseApiUrl, router);

    return app;
};

export { ${c}Route };
`;
}

function genSwaggerComponents(cfg) {
    const { modulePascal, moduleCamel, apis, responseCodeStart: n, crudFields } = cfg;
    const P = modulePascal;
    const c = moduleCamel;
    const idField = `${c}Id`;

    const outputFields = crudFields
        ? crudFields.filter(f => !['action', 'createdUpdatedBy'].includes(f.name))
        : [{ name: idField }, { name: 'templeId' }, { name: 'status' }];

    function swaggerType(f) {
        const n = f.name.toLowerCase();
        const t = (f.sqlType || '').toUpperCase();
        if (n.endsWith('id') || t.startsWith('INT') || t.startsWith('BIGINT') || t.startsWith('TINYINT')) return 'integer';
        if (t.startsWith('DECIMAL') || t.startsWith('FLOAT') || t.startsWith('DOUBLE')) return 'number';
        return 'string';
    }

    function swaggerExample(f) {
        const t = swaggerType(f);
        if (t === 'integer') return f.name.endsWith('Id') ? 1 : 0;
        if (t === 'number')  return 0;
        if (f.name.toLowerCase().includes('date')) return '2026-08-15';
        if (f.name === 'status') return 'ACTIVE';
        return `Example ${toTitle(f.name)}`;
    }

    function propBlock(fields) {
        return fields.map(f => {
            const t = swaggerType(f);
            const ex = swaggerExample(f);
            return `                ${f.name}: {\n                    type: '${t}',\n                    description: '${toTitle(f.name)}',\n                    example: ${typeof ex === 'string' ? `'${ex}'` : ex}\n                }`;
        }).join(',\n\n');
    }

    const addFields    = outputFields.filter(f => f.name !== idField);
    const updateFields = outputFields;

    let schemas = `import response from '../../configs/response.json';\nimport { common } from "../common";\n\nconst components = {\n    schemas: {\n\n`;

    if (apis.includes('add')) {
        schemas += `        ${c}AddInput: {\n            type: 'object',\n            properties: {\n\n${propBlock(addFields)}\n\n            }\n        },\n\n        ${c}AddOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 0}"] }\n            }\n        },\n\n`;
    }

    if (apis.includes('update')) {
        schemas += `        ${c}UpdateInput: {\n            type: 'object',\n            properties: {\n\n${propBlock(updateFields)}\n\n            }\n        },\n\n        ${c}UpdateOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 1}"] }\n            }\n        },\n\n`;
    }

    if (apis.includes('status')) {
        schemas += `        ${c}StatusInput: {\n            type: 'object',\n            properties: {\n                ${idField}: { type: 'integer', description: '${P} id', example: 1 },\n                status: { type: 'string', description: 'ACTIVE or DEACTIVE', example: 'ACTIVE' }\n            }\n        },\n\n        ${c}StatusOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 2}"] }\n            }\n        },\n\n`;
    }

    if (apis.includes('delete')) {
        schemas += `        ${c}DeleteOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 2}"] }\n            }\n        },\n\n`;
    }

    schemas += `        ${c}OutputData: {\n            type: 'object',\n            properties: {\n\n${propBlock(outputFields)}\n\n            }\n        },\n\n`;

    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        schemas += `        ${c}SelectByIdOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 3}"] },\n                data: { $ref: '#/components/schemas/${c}OutputData' }\n            }\n        },\n\n`;
    }

    if (apis.includes('search')) {
        schemas += `        ${c}SearchInput: {\n            type: 'object',\n            properties: {\n                ...common.searchCommonProperties\n            }\n        },\n\n        ${c}SearchOutput: {\n            type: 'object',\n            properties: {\n                status: { type: 'integer', example: 1 },\n                message: { type: 'string', example: response["${n + 6}"] },\n                data: {\n                    type: 'object',\n                    properties: {\n                        data: { type: 'array', items: { $ref: '#/components/schemas/${c}OutputData' } },\n                        page: { type: 'integer', example: 1 },\n                        noOf: { type: 'integer', example: 10 },\n                        total: { type: 'integer', example: 25 }\n                    }\n                }\n            }\n        }\n\n`;
    }

    schemas += `    }\n};\n\nexport default { ...components };\n`;
    return schemas;
}

function genSwaggerApi(cfg) {
    const { modulePascal, moduleCamel, apis, responseCodeStart: n } = cfg;
    const P = modulePascal;
    const c = moduleCamel;
    const idField = `${c}Id`;

    let out = `import tags from "../tag-constant";\nimport response from "../../configs/response.json";\nimport { SwaggerService } from "../common";\n\n`;

    function apiBlock(name, method, opId, desc, bodySchema, outputSchema, params) {
        const hasBody  = !!bodySchema;
        const hasParam = !!params;
        let block = `/*=========================================================\n    ${name}\n=========================================================*/\n\nexport const ${opId} = {\n    ${method}: {\n        tags: [tags.${c}],\n        summary: "Admin Access",\n        description: "${desc}",\n        operationId: "${opId}",\n        security: SwaggerService.bearerAuth(),\n`;
        if (hasParam) block += `        parameters: SwaggerService.parameters([{ name: "${idField}", in: "path", type: "integer", required: true, example: 1 }]),\n`;
        if (hasBody)  block += `        requestBody: SwaggerService.requestBody("${bodySchema}"),\n`;
        block += `        responses: SwaggerService.successResponse(response["${outputSchema[0]}"], "${outputSchema[1]}")\n    }\n};\n\n`;
        return block;
    }

    if (apis.includes('add'))    out += apiBlock(`Add ${P}`,        'post',   `add${P}`,        `Create a new ${P.toLowerCase()}.`, `${c}AddInput`,    [`${n+0}`, `${c}AddOutput`]);
    if (apis.includes('update')) out += apiBlock(`Update ${P}`,     'put',    `update${P}`,     `Update ${P.toLowerCase()}.`,       `${c}UpdateInput`, [`${n+1}`, `${c}UpdateOutput`]);
    if (apis.includes('status')) out += apiBlock(`${P} Status`,     'put',    `status${P}`,     `Change ${P.toLowerCase()} status.`,`${c}StatusInput`, [`${n+2}`, `${c}StatusOutput`]);
    if (apis.includes('delete')) out += apiBlock(`Delete ${P}`,     'delete', `delete${P}`,     `Delete ${P.toLowerCase()}.`,       null,              [`${n+2}`, `${c}DeleteOutput`], true);
    if (apis.includes('selectbyid') || apis.includes('selectById'))
        out += apiBlock(`Select ${P} By Id`, 'get', `selectById${P}`, `Get ${P.toLowerCase()} by id.`, null, [`${n+3}`, `${c}SelectByIdOutput`], true);
    if (apis.includes('search')) out += apiBlock(`Search ${P}`,     'post',   `search${P}`,     `Search ${P.toLowerCase()} list.`, `${c}SearchInput`, [`${n+6}`, `${c}SearchOutput`]);

    return out;
}

function genSwaggerIndex(cfg) {
    const { modulePascal, moduleCamel, moduleKebab, moduleTitle, apis } = cfg;
    const P = modulePascal;
    const c = moduleCamel;
    const idField = `${c}Id`;

    const importNames = [];
    const pathEntries = [];

    if (apis.includes('add'))    { importNames.push(`add${P}`);        pathEntries.push(`        "/${P}/Add": add${P}`); }
    if (apis.includes('update')) { importNames.push(`update${P}`);     pathEntries.push(`        "/${P}/Update": update${P}`); }
    if (apis.includes('status')) { importNames.push(`status${P}`);     pathEntries.push(`        "/${P}/Status": status${P}`); }
    if (apis.includes('delete')) { importNames.push(`delete${P}`);     pathEntries.push(`        "/${P}/Delete/{${idField}}": delete${P}`); }
    if (apis.includes('selectbyid') || apis.includes('selectById')) {
        importNames.push(`selectById${P}`);
        pathEntries.push(`        "/${P}/SelectById/{${idField}}": selectById${P}`);
    }
    if (apis.includes('search')) { importNames.push(`search${P}`);     pathEntries.push(`        "/${P}/Search": search${P}`); }

    return `import tags from "../tag-constant";
import components from "./components";

import {
    ${importNames.join(',\n    ')}
} from "./api";

const ${c} = {

    ...components,

    tags: [
        {
            name: tags.${c},
            description: "${moduleTitle} Management"
        }
    ],

    paths: {
${pathEntries.join(',\n')}
    }

};

export default ${c};
`;
}

// ─── Index File Updaters ─────────────────────────────────────

function updateIndexFile(filePath, exportLine) {
    if (!fs.existsSync(filePath)) { console.warn(`  ⚠️  Index not found: ${filePath}`); return; }
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(exportLine)) { console.log(`  ℹ️  Already exists in ${path.basename(filePath)}`); return; }
    fs.appendFileSync(filePath, '\n' + exportLine);
    console.log(`  ✅ Updated ${path.basename(filePath)}`);
}

function updateResponseJson(codes) {
    const rPath = path.join(SRC, 'configs', 'response.json');
    if (!fs.existsSync(rPath)) { console.warn('  ⚠️  response.json not found'); return; }
    const data = JSON.parse(fs.readFileSync(rPath, 'utf8'));
    let added = 0;
    for (const [key, val] of Object.entries(codes)) {
        if (!data[key]) { data[key] = val; added++; }
        else console.log(`  ℹ️  Code ${key} already exists, skipped.`);
    }
    fs.writeFileSync(rPath, JSON.stringify(data, null, 4));
    console.log(`  ✅ response.json — ${added} new codes added`);
}

function updateTagConstant(cfg) {
    const { moduleCamel, moduleTitle } = cfg;
    const tPath = path.join(SRC, 'swagger-document', 'tag-constant.ts');
    if (!fs.existsSync(tPath)) { console.warn('  ⚠️  tag-constant.ts not found'); return; }
    let content = fs.readFileSync(tPath, 'utf8');
    if (content.includes(`${moduleCamel}:`)) { console.log('  ℹ️  Tag already exists in tag-constant.ts'); return; }
    // Insert before closing brace
    content = content.replace(/^};/m, `    ${moduleCamel}: '${moduleTitle}',\n};`);
    fs.writeFileSync(tPath, content);
    console.log('  ✅ tag-constant.ts updated');
}

function updateSwaggerIndex(cfg) {
    const { moduleCamel, moduleKebab } = cfg;
    const iPath = path.join(SRC, 'swagger-document', 'index.ts');
    if (!fs.existsSync(iPath)) { console.warn('  ⚠️  swagger-document/index.ts not found'); return; }
    let content = fs.readFileSync(iPath, 'utf8');

    const importLine = `import ${moduleCamel} from './${moduleKebab}';`;
    if (!content.includes(importLine)) {
        // Add after last import
        content = content.replace(/(import[^\n]+\n)(\n\/\*)/m, `$1${importLine}\n$2`);
        console.log('  ✅ swagger index — import added');
    }

    // Add to modules array
    if (!content.includes(`    ${moduleCamel},`)) {
        content = content.replace(/^];/m, `    ${moduleCamel},\n];`);
        console.log('  ✅ swagger index — module registered');
    }

    // Add security to swagger-document/index.ts if needed
    if (moduleCamel === 'security' && !content.includes("import security")) {
        console.log('  ℹ️  Security module — check swagger index manually if needed');
    }

    fs.writeFileSync(iPath, content);
}

// ─── Write File Helper ───────────────────────────────────────

function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(filePath)) {
        const bak = filePath + '.bak';
        fs.copyFileSync(filePath, bak);
        console.log(`  📋 Backup created: ${path.basename(bak)}`);
    }
    fs.writeFileSync(filePath, content);
    console.log(`  ✅ ${path.relative(ROOT, filePath)}`);
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
    const cfg = await askConfig();
    const { modulePascal, moduleCamel, moduleKebab, scenario, apis, responseCodeStart } = cfg;

    console.log('\n─────────────────────────────────────────────────────');
    console.log(`  Generating: ${modulePascal}  |  Scenario: ${scenario}`);
    console.log(`  APIs: ${apis.join(', ')}`);
    console.log(`  Response codes: ${responseCodeStart} – ${responseCodeStart + 6}`);
    console.log('─────────────────────────────────────────────────────\n');

    if (scenario === '1') {
        // ── Create whole new module

        console.log('📁 Generating model...');
        writeFile(
            path.join(SRC, 'app', 'model', `${moduleKebab}.model.ts`),
            genModel(cfg)
        );

        console.log('📁 Generating controller...');
        writeFile(
            path.join(SRC, 'app', 'controller', `${moduleKebab}.controller.ts`),
            genController(cfg)
        );

        console.log('📁 Generating schema...');
        writeFile(
            path.join(SRC, 'app', 'schema', `${moduleKebab}.schema.ts`),
            genSchema(cfg)
        );

        console.log('📁 Generating route...');
        writeFile(
            path.join(SRC, 'app', 'route', `${moduleKebab}.route.ts`),
            genRoute(cfg)
        );

        console.log('📁 Generating swagger files...');
        const swDir = path.join(SRC, 'swagger-document', moduleKebab);
        writeFile(path.join(swDir, 'components.ts'), genSwaggerComponents(cfg));
        writeFile(path.join(swDir, 'api.ts'),        genSwaggerApi(cfg));
        writeFile(path.join(swDir, 'index.ts'),      genSwaggerIndex(cfg));

        console.log('\n📝 Updating index files...');
        updateIndexFile(path.join(SRC, 'app', 'model',      'index.ts'), `export * from './${moduleKebab}.model';`);
        updateIndexFile(path.join(SRC, 'app', 'controller', 'index.ts'), `export * from './${moduleKebab}.controller';`);
        updateIndexFile(path.join(SRC, 'app', 'schema',     'index.ts'), `export * from './${moduleKebab}.schema';`);
        updateIndexFile(path.join(SRC, 'app', 'route',      'index.ts'), `export * from './${moduleKebab}.route';`);

        console.log('\n📝 Updating response.json...');
        updateResponseJson(buildResponseCodes(responseCodeStart, apis, modulePascal));

        console.log('\n📝 Updating tag-constant.ts...');
        updateTagConstant(cfg);

        console.log('\n📝 Updating swagger index...');
        updateSwaggerIndex(cfg);

    } else if (scenario === '2') {
        // ── Add APIs to existing module
        console.log('ℹ️  Scenario 2: Open the generated file patches below and merge manually.\n');

        console.log('--- CONTROLLER METHODS TO ADD ---');
        console.log(genController(cfg));
        console.log('--- ROUTE ENTRIES TO ADD ---');
        console.log(genRoute(cfg));
        console.log('--- SCHEMA ENTRIES TO ADD ---');
        console.log(genSchema(cfg));

    } else if (scenario === '3') {
        // ── Remove API
        console.log('\nTo remove an API from this module, delete:\n');
        apis.forEach(api => {
            const norm = api.toLowerCase();
            console.log(`  • Controller method: ${norm}() in ${moduleKebab}.controller.ts`);
            console.log(`  • Schema: ${toPascal(norm)}Schema in ${moduleKebab}.schema.ts`);
            console.log(`  • Sanitize fn: ${norm}${modulePascal}Sanitize in ${moduleKebab}.schema.ts`);
            console.log(`  • Route: router.${norm === 'search' || norm === 'add' ? 'post' : norm === 'update' || norm === 'status' ? 'put' : norm === 'delete' ? 'delete' : 'get'} entry in ${moduleKebab}.route.ts`);
            console.log(`  • Swagger api export in swagger-document/${moduleKebab}/api.ts`);
            console.log(`  • Swagger path entry in swagger-document/${moduleKebab}/index.ts\n`);
        });
    }

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║           Generation complete! ✅                ║');
    console.log('╚══════════════════════════════════════════════════╝\n');
}

main().catch(err => {
    console.error('\n❌ Generator error:', err.message);
    process.exit(1);
});

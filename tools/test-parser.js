// Quick test to verify SP parser works against work.sql
const fs   = require('fs');
const path = require('path');

const ROOT    = path.join(__dirname, '..');
const sqlPath = path.join(ROOT, 'database', 'work.sql');

function toCamel(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

function guessDefault(sqlType, fieldName) {
    const name = fieldName.toLowerCase();
    if (name === 'action') return '""';
    if (name.endsWith('id') && name !== 'id') return '0';
    if (name === 'status') return '"ACTIVE"';
    if (name.includes('json') || sqlType === 'JSON') return '"[]"';
    if (sqlType === 'ENUM') return '""';
    if (['INT','BIGINT','TINYINT','DECIMAL','FLOAT'].some(t => sqlType.startsWith(t))) return '0';
    return '""';
}

const content = fs.readFileSync(sqlPath, 'utf8');
const procRe  = /CREATE\s+(?:DEFINER\s*=\s*`[^`]*`@`[^`]*`\s+)?PROCEDURE\s+`?(\w+)`?\s*\(([\s\S]*?)\)\s*BEGIN/gi;

let match;
let found = 0;

while ((match = procRe.exec(content)) !== null) {
    found++;
    const spName     = match[1];
    const cleanBlock = match[2].replace(/\s+/g, ' ').trim();
    const paramRe    = /`?(_\w+)`?\s+(ENUM\s*\([^)]+\)|[\w]+(?:\s*\(\s*[\d,\s]+\s*\))?)/gi;

    let pm;
    const fields  = [];
    let   actions = [];

    while ((pm = paramRe.exec(cleanBlock)) !== null) {
        const raw     = pm[1].replace(/^_+/, '');
        const camel   = toCamel(raw);
        const rawType = pm[2];
        const sqlType = /^ENUM/i.test(rawType) ? 'ENUM' : rawType.split('(')[0].toUpperCase();

        if (camel === 'action') {
            const vm = rawType.match(/ENUM\s*\(([^)]+)\)/i);
            if (vm) actions = vm[1].split(',').map(v => v.trim().replace(/['"]/g, ''));
        }

        fields.push({ name: camel, sqlType, default: guessDefault(sqlType, camel) });
    }

    const selectKeywords = ['CHECK','SELECTBYID','SELECTBYDATE','SELECTBYMONTH','SELECT','VALIDATE','VERIFY','SELECT_BY_CODE','GENERATE_DEFAULT_TEMPLATE','PENDING'];
    const selectActions  = actions.filter(a => selectKeywords.some(k => a.toUpperCase().includes(k)));
    const executeActions = actions.filter(a => !selectActions.includes(a));

    console.log(`\n✅ SP: ${spName}`);
    console.log(`   Parameters (${fields.length}):`);
    fields.forEach(f => console.log(`     ${f.name.padEnd(28)} ${f.sqlType.padEnd(12)} default: ${f.default}`));
    console.log(`   All actions:     ${actions.join(', ') || '(none found)'}`);
    console.log(`   SELECT actions:  ${selectActions.join(', ') || '(none)'}`);
    console.log(`   EXECUTE actions: ${executeActions.join(', ') || '(none)'}`);
}

if (found === 0) {
    console.log('⚠️  No stored procedures found. Check that work.sql has CREATE PROCEDURE statements with BEGIN keyword.');
} else {
    console.log(`\n✅ Parser test complete — ${found} SP(s) found.`);
}

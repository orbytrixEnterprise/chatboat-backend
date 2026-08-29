# Solvify Tech — Module Generator

A zero-dependency code generator that follows your exact project architecture.

## Usage

```cmd
node tools/generator.js
```

Run it and answer the interactive prompts. That's it.

---

## What It Generates (Scenario 1 — New Module)

From a simple config it creates all 7 files and updates all index files automatically:

| File | Location |
|---|---|
| `{module}.model.ts` | `src/app/model/` |
| `{module}.controller.ts` | `src/app/controller/` |
| `{module}.schema.ts` | `src/app/schema/` |
| `{module}.route.ts` | `src/app/route/` |
| `swagger/{module}/components.ts` | `src/swagger-document/{module}/` |
| `swagger/{module}/api.ts` | `src/swagger-document/{module}/` |
| `swagger/{module}/index.ts` | `src/swagger-document/{module}/` |

**Also auto-updates:**
- `src/app/model/index.ts`
- `src/app/controller/index.ts`
- `src/app/schema/index.ts`
- `src/app/route/index.ts`
- `src/configs/response.json`
- `src/swagger-document/tag-constant.ts`
- `src/swagger-document/index.ts`

---

## SP Auto-Detection from work.sql

Paste your stored procedures in `database/work.sql` before running.
The generator reads the file and extracts all IN parameters automatically.

**Supported SP format:**
```sql
CREATE PROCEDURE `donation`(
    IN p_donation_id INT,
    IN p_temple_id INT,
    IN p_donor_name VARCHAR(200),
    IN p_amount DECIMAL(10,2),
    IN p_status VARCHAR(20),
    IN p_created_updated_by INT,
    IN p_action VARCHAR(50)
)
BEGIN
    -- your sp body
END
```

Prefixes `p_`, `in_`, `i_` are stripped and converted to camelCase automatically.

---

## Scenarios

| Scenario | What it does |
|---|---|
| 1 | Creates whole new module — all 7 files + updates all indexes |
| 2 | Adds new APIs to an existing module — prints diff to merge |
| 3 | Shows exactly what to remove for deleting an API |

---

## Reuse in Other Projects

This generator works in any project with the same architecture.
Just copy `tools/generator.js` to the other project's `tools/` folder and run it.

**Requirements:**
- Node.js (any version, uses only built-in modules)
- Project must have `src/` folder with standard structure
- `package.json` must exist at project root

---

## Response Code Convention

Codes are auto-detected from `response.json` and assigned in blocks of 20:

| Offset | Meaning |
|---|---|
| +0 | Add success |
| +1 | Update success |
| +2 | Status/Delete success (+2_deactive for deactivate) |
| +3 | Fetch by ID success |
| +4 | Not found |
| +5 | Already exists |
| +6 | List/Search fetched |

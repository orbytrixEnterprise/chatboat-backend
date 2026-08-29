import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/database/", "**/public/", "**/dist/", "**/nswag/", "**/eslint.config.mjs", "**/excel-to-db.controller.ts", "**/sync-to-server.ts"],
}, ...compat.extends("plugin:@typescript-eslint/recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-undef": "error",
        "no-var": "error",
        "array-callback-return": "error",
        "constructor-super": "error",
        "for-direction": "error",
        "no-async-promise-executor": "error",
        "no-cond-assign": "error",
        "no-const-assign": "error",
        "no-constructor-return": "error",
        "no-debugger": "error",
        "no-dupe-keys": "error",
        "no-dupe-else-if": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-ex-assign": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-import-assign": "error",
        "no-new-native-nonconstructor": "error",
        "no-obj-calls": "error",
        "no-promise-executor-return": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-sparse-arrays": "error",
        "no-this-before-super": "error",
        "no-unexpected-multiline": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable": "error",
        "no-unused-vars": "error",
        "no-use-before-define": "error",
        "use-isnan": "error",
        "valid-typeof": "error",
        "block-scoped-var": "error",
        camelcase: "error",

        "@typescript-eslint/naming-convention": ["error", {
            selector: "default",
            format: ["camelCase"],

            filter: {
                regex: "^/|200|application/json$",
                match: false,
            },
        }, {
                selector: "class",
                format: ["PascalCase"],
            }, {
                selector: "objectLiteralProperty",
                format: null,
            }],

        "consistent-return": "error",
        curly: "error",
        eqeqeq: "error",
        semi: "error",

        "semi-spacing": ["error", {
            before: false,
            after: true,
        }],

        "no-extra-semi": "error",
        "@typescript-eslint/no-unused-expressions": ["error", { "allowShortCircuit": true }]
    },
}];
"use strict";

const js = require("@eslint/js");
// epep v7 is ESM-only with no interop export, so require() yields { default }.
const eslintPlugin = require("eslint-plugin-eslint-plugin").default;
const nodePlugin = require("eslint-plugin-n");
const globals = require("globals");

module.exports = [
    {
        ignores: ["node_modules/**", "coverage/**", "tests/types/**"]
    },
    js.configs.recommended,
    eslintPlugin.configs.recommended,
    nodePlugin.configs["flat/recommended-script"],
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: globals.node
        },
        rules: {
            // meta.defaultOptions is only honoured from ESLint 9.15, but this plugin
            // supports ^9.0.0 -- relying on it would read undefined options on 9.0-9.14.
            "eslint-plugin/require-meta-default-options": "off"
        }
    },
    {
        files: ["**/*.mjs"],
        languageOptions: { sourceType: "module" }
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: globals.mocha
        },
        rules: {
            // assertionOptions.requireLocation only bites on the ESLint 10 entry.
            "eslint-plugin/require-test-error-positions": "error"
        }
    }
];

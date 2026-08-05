"use strict";

const js = require("@eslint/js");
// v7 is ESM-only with no `module.exports` interop export, so require() yields { default }.
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
            // meta.defaultOptions is only honoured from ESLint 9.15, and this plugin
            // supports ^9.0.0 -- a rule that relied on it would read undefined options
            // on 9.0-9.14. There is also nothing to default: the sole option is
            // customMessage, whose absence selects a different messageId.
            "eslint-plugin/require-meta-default-options": "off"
        }
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: globals.mocha
        }
    }
];

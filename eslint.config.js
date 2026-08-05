/**
 * Lint config for this repository. Flat config, so it is read by the ESLint 9
 * devDependency -- the previous `.eslintrc.js` was silently ignored by it.
 */
"use strict";

const js = require("@eslint/js");
const eslintPlugin = require("eslint-plugin-eslint-plugin");
const nodePlugin = require("eslint-plugin-n");
const globals = require("globals");

module.exports = [
    {
        ignores: ["node_modules/**", "coverage/**", "tests/types/**"]
    },
    js.configs.recommended,
    eslintPlugin.configs["flat/recommended"],
    nodePlugin.configs["flat/recommended-script"],
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: globals.node
        }
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: globals.mocha
        }
    }
];

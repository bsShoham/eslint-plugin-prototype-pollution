// Tests must resolve ESLint through here, never require("eslint") directly.
"use strict";

const pkgName = process.env.ESLINT_PKG || "eslint";
const eslint = require(pkgName);
const version = require(pkgName + "/package.json").version;
const major = Number(version.split(".", 1)[0]);

const unsafe = require(pkgName + "/use-at-your-own-risk");

const FlatESLint = major >= 9 ? eslint.ESLint : unsafe.FlatESLint;

// ESLint 10 removed eslintrc, so there is no engine to expose.
const supportsEslintrc = major < 10;
const LegacyESLint = major >= 10
    ? null
    : (major === 9 ? unsafe.LegacyESLint : eslint.ESLint);

// v8 defaults to ES5, and the option moved to languageOptions in v9.
function createRuleTester() {
    return major >= 9
        ? new eslint.RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: "script" } })
        : new eslint.RuleTester({ parserOptions: { ecmaVersion: 2022, sourceType: "script" } });
}

module.exports = {
    pkgName,
    version,
    major,
    createRuleTester,
    FlatESLint,
    LegacyESLint,
    supportsEslintrc
};

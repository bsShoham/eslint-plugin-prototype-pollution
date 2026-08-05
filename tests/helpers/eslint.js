// Tests must resolve ESLint through here, never require("eslint") directly.
"use strict";

const pkgName = process.env.ESLINT_PKG || "eslint";
const { ESLint, RuleTester } = require(pkgName);
const { version } = require(pkgName + "/package.json");

// RuleTester's own default ecmaVersion is below 2022.
function createRuleTester() {
    return new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: "script" } });
}

module.exports = { pkgName, version, ESLint, createRuleTester };

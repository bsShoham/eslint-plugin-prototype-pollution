/**
 * Resolves the ESLint under test. The suite runs once per supported major --
 * `eslint` (9), plus the `eslint8` and `eslint10` aliases -- so every test must
 * go through here instead of requiring "eslint" directly.
 */
"use strict";

const pkgName = process.env.ESLINT_PKG || "eslint";
const eslint = require(pkgName);
const version = require(pkgName + "/package.json").version;
const major = Number(version.split(".", 1)[0]);

const unsafe = require(pkgName + "/use-at-your-own-risk");

// Flat config is the `ESLint` class from v9 on; in v8 it is opt-in.
const FlatESLint = major >= 9 ? eslint.ESLint : unsafe.FlatESLint;

// ESLint 10 removed the eslintrc system outright, so there is no engine to get
// hold of. v9 keeps it behind `use-at-your-own-risk`, v8 exposes it as `ESLint`.
const supportsEslintrc = major < 10;
const LegacyESLint = major >= 10
    ? null
    : (major === 9 ? unsafe.LegacyESLint : eslint.ESLint);

/**
 * A RuleTester pinned to a modern ecmaVersion. v8 defaults to ES5 while v9+
 * default to latest, and the option moved from `parserOptions` to
 * `languageOptions`, so normalise it here rather than in every test file.
 */
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

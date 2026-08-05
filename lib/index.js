/**
 * @fileoverview Detect the use of prototype pollution vulnerabilities
 * @author bsShoham
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const pkg = require("../package.json");

const rules = {
    "no-bracket-notation-property-accessor": require("./rules/no-bracket-notation-property-accessor"),
    "no-unsafe-object-assign": require("./rules/no-unsafe-object-assign")
};

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const plugin = {
    meta: {
        // Not the package name: ESLint only uses this internally, and this matches the rule prefix.
        name: "prototype-pollution",
        version: pkg.version
    },
    configs: {},
    rules
};

const recommendedRules = {
    "prototype-pollution/no-unsafe-object-assign": "warn",
    "prototype-pollution/no-bracket-notation-property-accessor": "warn"
};

// Copied per config so a consumer mutating one cannot affect the other.
const recommendedFlat = {
    name: "prototype-pollution/recommended",
    plugins: { "prototype-pollution": plugin },
    rules: Object.assign({}, recommendedRules)
};

const recommendedLegacy = {
    plugins: ["prototype-pollution"],
    rules: Object.assign({}, recommendedRules)
};

Object.assign(plugin.configs, {
    recommended: recommendedFlat,
    "recommended-legacy": recommendedLegacy,
    // No "legacy/recommended" counterpart: eslintrc splits `plugin:name/config` on the
    // first slash, so it would resolve as a plugin named "prototype-pollution/legacy".
    "flat/recommended": recommendedFlat
});

module.exports = plugin;

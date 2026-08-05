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
        // The plugin's own name, deliberately kept short and matching the
        // `prototype-pollution` prefix rules are configured under. ESLint only
        // uses this to identify the plugin internally, not to resolve rules.
        name: "prototype-pollution",
        version: pkg.version
    },
    configs: {},
    rules
};

// The severities shared by every flavour of the recommended config. Each config
// below gets its own copy so that a consumer mutating one cannot affect another.
const recommendedRules = {
    "prototype-pollution/no-unsafe-object-assign": "warn",
    "prototype-pollution/no-bracket-notation-property-accessor": "warn"
};

/**
 * Flat config (`eslint.config.js`), ESLint 9 and ESLint 8.21+.
 * `plugins` is an object and the plugin references itself, so consumers do not
 * need to register it separately.
 */
const recommendedFlat = {
    name: "prototype-pollution/recommended",
    plugins: { "prototype-pollution": plugin },
    rules: Object.assign({}, recommendedRules)
};

/**
 * eslintrc config (`.eslintrc`, `.eslintrc.js`, `.eslintrc.json`), ESLint 8 and
 * below. `plugins` must be an array of plugin name strings here -- passing the
 * flat config to `extends` instead fails schema validation.
 */
const recommendedLegacy = {
    plugins: ["prototype-pollution"],
    rules: Object.assign({}, recommendedRules)
};

Object.assign(plugin.configs, {
    recommended: recommendedFlat,
    "recommended-legacy": recommendedLegacy,
    // Alias for callers who prefer to be explicit about the format. Only flat
    // config can address a name containing a slash: eslintrc's `extends` splits
    // "plugin:prototype-pollution/flat/recommended" into the plugin
    // "prototype-pollution/flat" plus the config "recommended", so there is
    // deliberately no "legacy/recommended" counterpart.
    "flat/recommended": recommendedFlat
});

module.exports = plugin;

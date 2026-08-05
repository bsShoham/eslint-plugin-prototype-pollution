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
        name: pkg.name,
        // Lets defineConfig() rewrite rule IDs if a consumer registers the plugin
        // under a different key.
        namespace: "prototype-pollution",
        version: pkg.version
    },
    configs: {},
    rules
};

Object.assign(plugin.configs, {
    recommended: {
        name: "prototype-pollution/recommended",
        plugins: { "prototype-pollution": plugin },
        rules: {
            "prototype-pollution/no-unsafe-object-assign": "warn",
            "prototype-pollution/no-bracket-notation-property-accessor": "warn"
        }
    }
});

module.exports = plugin;

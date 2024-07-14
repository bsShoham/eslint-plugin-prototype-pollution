/**
 * @fileoverview Detect the use of prototype pollution vulnerabilities
 * @author bsShoham
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const pkg = require("../package.json");

const plugin = {
    meta: {
        name: "prototype-pollution",
        version: pkg.version
    },
    configs: {},
    // import all rules in lib/rules
    rules: requireIndex(__dirname + "/rules")
}

const recommended = {
    rules: {
        'prototype-pollution/no-unsafe-object-assign': 'warn',
        'prototype-pollution/no-bracket-notation-property-accessor': 'warn'
    }
};

const recommendedLegacy = {
    plugins: ['prototype-pollution'],
    rules: recommended.rules
}

Object.assign(plugin.configs, {
  recommended,
  'recommended-legacy': recommendedLegacy
});

module.exports = plugin;



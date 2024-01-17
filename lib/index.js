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

module.exports = {
    meta: {
        name: "prototype-pollution-security-rules",
        version: "0.1.0"
    },
    configs: {
        recommended: {
            plugins: [
                'prototype-pollution-security-rules'
            ],
            rules: {
                'prototype-pollution-security-rules/no-unsafe-object-assign': 'warn',
                'prototype-pollution-security-rules/no-bracket-notation-property-accessor': 'warn'
            }
        }
    },
    // import all rules in lib/rules
    rules: requireIndex(__dirname + "/rules")
}






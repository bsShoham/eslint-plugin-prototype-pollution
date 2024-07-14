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
        name: "prototype-pollution",
        version: "0.1.6"
    },
    configs: {
        recommended: {
            rules: {
                'prototype-pollution/no-unsafe-object-assign': 'warn',
                'prototype-pollution/no-bracket-notation-property-accessor': 'warn'
            }
        }
    },
    // import all rules in lib/rules
    rules: requireIndex(__dirname + "/rules")
}






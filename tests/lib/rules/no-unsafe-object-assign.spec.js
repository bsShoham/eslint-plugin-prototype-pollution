/* eslint-disable eslint-plugin/consistent-output */
const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-unsafe-object-assign'); // replace with the path to your rule file

const ruleTester = new RuleTester();

ruleTester.run('no-unsafe-object-assign', rule, {
    valid: [
        // add here all the cases that should pass
        "Object.assign({}, obj1, obj2)",
        "Object.assign({prop: 1}, obj1, obj2)",
        "Object.assign({prop: 1}, obj1, {prop2: 2})"
    ],

    invalid: [
        // add here all the cases that should not pass
        {
            code: "Object.assign(obj1, obj2)",
            errors: [{
                messageId: "avoidObjectAssign",
                type: "CallExpression",
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2)"
                }]
            }],
        },
        {
            code: "Object.assign(obj1, {prop: 1})",
            errors: [{
                messageId: "avoidObjectAssign",
                type: "CallExpression",
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, {prop: 1})"
                }]
            }]
        },
        {
            code: "Object.assign(obj1, obj2, obj3)",
            errors: [{
                messageId: "avoidObjectAssign",
                type: "CallExpression",
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2, obj3)"
                }]
            }]
        },
        {
            code: "Object.assign(obj1, obj2)", 
            name: "Test custom message",
            options: [{
                customMessage: "custom message"
            }], 
            errors: [{
                message: "custom message",
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2)"
                }]
            }]
        }
    ]
});
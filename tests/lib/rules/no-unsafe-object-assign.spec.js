const { createRuleTester } = require('../../helpers/eslint');
const rule = require('../../../lib/rules/no-unsafe-object-assign');

const ruleTester = createRuleTester();

ruleTester.run('no-unsafe-object-assign', rule, {
    valid: [
        "Object.assign({}, obj1, obj2)",
        "Object.assign({prop: 1}, obj1, obj2)",
        "Object.assign({prop: 1}, obj1, {prop2: 2})",
        // No first argument to inspect; must not throw.
        "Object.assign()",
        "Object.assign;",
        "assign(obj1, obj2)",
        "Other.assign(obj1, obj2)"
    ],

    invalid: [
        {
            code: "Object.assign(obj1, obj2)",
            errors: [{
                messageId: "avoidObjectAssign",
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
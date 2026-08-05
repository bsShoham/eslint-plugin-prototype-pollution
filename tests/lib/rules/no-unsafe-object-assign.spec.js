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
            name: "Reports a non-literal target",
            code: "Object.assign(obj1, obj2)",
            errors: [{
                messageId: "avoidObjectAssign",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 26,
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2)"
                }]
            }]
        },
        {
            name: "Reports even when a later argument is a literal",
            code: "Object.assign(obj1, {prop: 1})",
            errors: [{
                messageId: "avoidObjectAssign",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 31,
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, {prop: 1})"
                }]
            }]
        },
        {
            name: "Reports with three arguments",
            code: "Object.assign(obj1, obj2, obj3)",
            errors: [{
                messageId: "avoidObjectAssign",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 32,
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2, obj3)"
                }]
            }]
        },
        {
            name: "Test custom message",
            code: "Object.assign(obj1, obj2)",
            options: [{
                customMessage: "custom message"
            }],
            errors: [{
                message: "custom message",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 26,
                suggestions: [{
                    messageId: "mitigateObjectAssign",
                    output: "Object.assign({}, obj1, obj2)"
                }]
            }]
        }
    ],

    // requireLocation is enforced only by the ESLint 10 entry.
    assertionOptions: { requireMessage: true, requireData: true, requireLocation: true }
});

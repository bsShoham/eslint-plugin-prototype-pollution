const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-bracket-notation-property-accessor'); // replace with the path to your rule file

const ruleTester = new RuleTester();

ruleTester.run('no-bracket-notation-property-accessor', rule, {
    valid: [
        // add here all the cases that should pass
        "obj['prop']",
        "obj[1]",
        `
            obj.hasOwnProperty(variable);
            obj[variable];
        `,
        `
            obj.hasOwn(variable);
            obj[variable];
        `,
        `
            Object.prototype.hasOwnProperty.call(obj, variable);
            obj[variable];
        `,
        `
            Object.prototype.hasOwn.call(obj, variable);
            obj[variable];
        `,
    ],

    invalid: [
        // add here all the cases that should not pass
        {
            code: "obj[variable]",
            errors: [{
                messageId: "avoidBracketNotation",
                type: "MemberExpression"
            }]
        },
        {
            code: `
                obj[variable];
                obj.hasOwn(variable);
            `,
            errors: [{
                messageId: "avoidBracketNotation",
                type: "MemberExpression"
            }]
        },
        {
            name: "Test custom message",
            options: [{
                customMessage: "custom message"
            }],
            code: "obj[variable]",
            errors: [{
                message: "custom message"
            }]
        }
    ]
});
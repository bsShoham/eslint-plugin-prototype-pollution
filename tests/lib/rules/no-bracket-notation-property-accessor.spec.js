const { createRuleTester } = require('../../helpers/eslint');
const rule = require('../../../lib/rules/no-bracket-notation-property-accessor');

const ruleTester = createRuleTester();

ruleTester.run('no-bracket-notation-property-accessor', rule, {
    valid: [
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
        {
            // Non-Identifier object, so the rule reads the object's source text.
            name: "Reports a computed access on a call result",
            code: "foo().bar[variable]",
            errors: [{
                messageId: "avoidBracketNotation",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 20
            }]
        },
        {
            name: "Reports a computed access on an identifier",
            code: "obj[variable]",
            errors: [{
                messageId: "avoidBracketNotation",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 14
            }]
        },
        {
            name: "Reports when the hasOwn check comes after the access",
            code: `
                obj[variable];
                obj.hasOwn(variable);
            `,
            errors: [{
                messageId: "avoidBracketNotation",
                line: 2,
                column: 17,
                endLine: 2,
                endColumn: 30
            }]
        },
        {
            name: "Test custom message",
            options: [{
                customMessage: "custom message"
            }],
            code: "obj[variable]",
            errors: [{
                message: "custom message",
                line: 1,
                column: 1,
                endLine: 1,
                endColumn: 14
            }]
        }
    ],

    // requireLocation is enforced only by the ESLint 10 entry.
    assertionOptions: { requireMessage: true, requireData: true, requireLocation: true }
});

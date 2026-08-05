module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Detect unsafe usage of Object.assign',
            recommended: true,
            url: "https://github.com/shoham-utila/eslint-plugin-prototype-pollution/blob/main/docs/rules/no-unsafe-object-assign.md"
        },
        messages: {
            avoidObjectAssign: 'Avoid unsafe usage of Object.assign',
            mitigateObjectAssign: 'Use Object.assign with an object literal as the first argument',
            customMessage: "{{customMessage}}",
        },
        hasSuggestions: true,
        schema: [{
            type: 'object',
            description: 'Options for the Object.assign rule.',
            properties: {
                customMessage: {
                    type: 'string',
                    description: 'Replaces the default report message with your own text.'
                }
            },
            additionalProperties: false
        }],
    },
    create: function (context) {
        const customMessage = (context.options[0] && context.options[0].customMessage) || undefined;
        return {
            CallExpression: function (node) {
                const callee = node.callee;
                if (
                    callee.type === 'MemberExpression' &&
                    callee.object.type === 'Identifier' &&
                    callee.object.name === 'Object' &&
                    callee.property.type === 'Identifier' &&
                    callee.property.name === 'assign' &&
                    node.arguments[0] &&
                    node.arguments[0].type !== 'ObjectExpression'
                ) {
                    context.report({
                        node: node,
                        messageId: customMessage ? "customMessage" : 'avoidObjectAssign',
                        data: { customMessage },
                        suggest: [
                             {
                                messageId: "mitigateObjectAssign",
                                fix: function(fixer) {
                                    return fixer.insertTextBefore(node.arguments[0], "{}, ");
                                }
                            }
                        ]
                    });
                }
            },
        };
    },
};

module.exports = {
    meta: {
        name: __filename,
        type: 'suggestion',
        docs: {
            description: 'Detect unsafe usage of Object.assign',
            category: 'Best Practices',
            recommended: true,
            url: ""
        },
        messages: {
            avoidObjectAssign: 'Avoid unsafe usage of Object.assign',
            mitigateObjectAssign: 'Use the spread operator instead, or use Object.assign with an object literal as the first argument (Object.assign({}, obj1, obj2))',
            customMessage: "{{customMessage}}",
        },
        hasSuggestions: true,
        schema: [{ type: 'object', properties: { customMessage: { type: 'string' } }}],
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

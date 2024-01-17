module.exports = {
    meta: {
        name: "no-bracket-notation-property-accessor",
        type: 'suggestion',
        docs: {
            description: 'Detect unsafe usage of bracket notation property accessor',
            category: 'Best Practices',
            recommended: true,
            url: "https://github.com/bsShoham/eslint-plugin-prototype-pollution/blob/main/docs/rules/no-bracket-notation-property-accessor.md"
        },
        messages: {
            avoidBracketNotation: 'Avoid usage of bracket notation as property accessor',
            mitigateBracketNotation: 'Verify that the property name is a string literal, use dot notation, or use `hasOwnProperty` to check if the property exists before accessing it',
            customMessage: "{{customMessage}}",
        },
        schema: [{ type: 'object', properties: { customMessage: { type: 'string' } } }],
    },
    create: function (context) {
        const customMessage = (context.options[0] && context.options[0].customMessage) || undefined;
        const hasOwnCalls = (new Map());
        return {
            CallExpression: function (node) {
                const callee = node.callee;
                // Catch calls to hasOwnProperty / hasOwn
                if (callee.type === 'MemberExpression' &&
                    callee.property.type === "Identifier" &&
                    callee.object.type === "Identifier" &&
                    node.arguments[0] &&
                    node.arguments[0].type === "Identifier" &&
                    (callee.property.name === 'hasOwnProperty' || callee.property.name === 'hasOwn')
                ) {

                    const objectName = callee.object.name;
                    const variableName = node.arguments[0].name;
                    const checkedVariables = hasOwnCalls.get(objectName) || new Set();
                    hasOwnCalls.set(objectName, checkedVariables.add(variableName));

                }
                // Catch calls to Object.hasOwnProperty.call / Object.hasOwn.call
                if (callee.type === 'MemberExpression' &&
                    callee.property.type === "Identifier" &&
                    callee.object.type === "MemberExpression" &&
                    callee.object.property.type === "Identifier" &&
                    (callee.object.property.name === 'hasOwnProperty' || callee.object.property.name === 'hasOwn') &&
                    node.arguments[0] &&
                    node.arguments[0].type === "Identifier" &&
                    node.arguments[1] &&
                    node.arguments[1].type === "Identifier"
                ) {
                    const objectName = node.arguments[0].name;
                    const variableName = node.arguments[1].name;
                    const checkedVariables = hasOwnCalls.get(objectName) || new Set();
                    checkedVariables.add(variableName)
                    hasOwnCalls.set(objectName, checkedVariables);
                }

            },
            MemberExpression: function (node) {
                if (
                    node.computed &&
                    node.property.type === "Identifier"
                ) {
                    const objectName = node.object.type === "Identifier" ? node.object.name : context.sourceCode.getText(node.object);
                    const variableName = node.property.name;
                    const objectHasOwnCalls = hasOwnCalls.get(objectName)
                    if (objectHasOwnCalls && objectHasOwnCalls.has(variableName)) {
                        return;
                    }
                    context.report({
                        node: node,
                        messageId: customMessage ? "customMessage" : 'avoidBracketNotation',
                        data: { customMessage }
                    });
                }
            },
        };
    },
};

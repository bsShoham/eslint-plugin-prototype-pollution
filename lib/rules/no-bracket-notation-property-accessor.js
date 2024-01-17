const hasOwnPropertyRegex = (objectName, variableName) => new RegExp(`\\b${objectName}\\.hasOwnProperty\\(\\s*${variableName}\\s*\\)|hasOwnProperty\\s*\\.call\\(\\s*${objectName}\\s*,\\s*${variableName}\\s*\\)|\\b${objectName}\\.hasOwn\\(\\s*${variableName}\\s*\\)`)

module.exports = {
    meta: {
        name: __filename,
        type: 'suggestion',
        docs: {
            description: 'Detect unsafe usage of bracket notation property accessor',
            category: 'Best Practices',
            recommended: true,
            url: ""
        },
        messages: {
            avoidBracketNotation: 'Avoid usage of bracket notation as property accessor',
            mitigateBracketNotation: 'Verify that the property name is a string literal, use dot notation, or use `hasOwnProperty` to check if the property exists before accessing it',
            customMessage: "{{customMessage}}",
        },
        schema: [{ type: 'object', properties: { customMessage: { type: 'string' } }}],
    },
    create: function (context) {
        const customMessage = (context.options[0] && context.options[0].customMessage) || undefined;
        return {
            MemberExpression: function (node) {
                if (
                    node.computed &&
                    node.property.type === "Identifier"
                ) {
                    const objectName = node.object.type === "Identifier" ? node.object.name : context.sourceCode.getText(node.object);
                    const variableName = node.property.name;
                    const regex = hasOwnPropertyRegex(objectName, variableName);
                    const regexMatch = regex.exec(context.sourceCode.text);
                    if (regexMatch && node.range && regexMatch.index <= node.range[0]) {
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

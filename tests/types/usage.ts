// Compiled by `npm run lint:types`, never executed.
import plugin = require("../../types/index");

const flatConfig = [plugin.configs.recommended];
const flatAlias = [plugin.configs["flat/recommended"]];

const selfRegistered: unknown = plugin.configs.recommended.plugins["prototype-pollution"];

const manualFlat = [
    {
        plugins: { "prototype-pollution": plugin },
        rules: {
            "prototype-pollution/no-unsafe-object-assign": "error",
            "prototype-pollution/no-bracket-notation-property-accessor": [
                "error",
                { customMessage: "add a hasOwn check" }
            ]
        } satisfies plugin.RulesRecord
    }
];

const legacyPlugins: readonly string[] = plugin.configs["recommended-legacy"].plugins;

const bracketRule = plugin.rules["no-bracket-notation-property-accessor"];
const assignRule = plugin.rules["no-unsafe-object-assign"];
const suggestionsSupported: boolean | undefined = assignRule.meta.hasSuggestions;

const pluginName: string = plugin.meta.name;
const pluginVersion: string = plugin.meta.version;

const severities: plugin.RuleEntry[] = ["off", "warn", "error", 0, 1, 2, ["error"], ["error", {}]];

export {
    flatConfig,
    flatAlias,
    selfRegistered,
    manualFlat,
    legacyPlugins,
    bracketRule,
    suggestionsSupported,
    pluginName,
    pluginVersion,
    severities
};

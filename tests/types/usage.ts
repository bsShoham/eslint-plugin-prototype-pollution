/**
 * Type-level smoke test: compiled by `npm run lint:types`, never executed.
 * Mirrors the snippets in the README so a broken d.ts fails the build.
 */
import plugin = require("../../types/index");

// Flat config, the shape a consumer's eslint.config.js exports.
const flatConfig = [plugin.configs.recommended];
const flatAlias = [plugin.configs["flat/recommended"]];

// The flat config registers the plugin itself.
const selfRegistered: unknown = plugin.configs.recommended.plugins["prototype-pollution"];

// Manual flat setup with an option object.
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

// eslintrc config: plugins must be a string array here.
const legacyPlugins: readonly string[] = plugin.configs["recommended-legacy"].plugins;

// Rules are addressable by their documented names.
const bracketRule = plugin.rules["no-bracket-notation-property-accessor"];
const assignRule = plugin.rules["no-unsafe-object-assign"];
const suggestionsSupported: boolean | undefined = assignRule.meta.hasSuggestions;

const pluginName: string = plugin.meta.name;
const pluginVersion: string = plugin.meta.version;

// Severity spellings that ESLint accepts.
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

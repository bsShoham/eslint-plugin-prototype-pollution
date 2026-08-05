/**
 * These types are deliberately self-contained and do not import from "eslint".
 * `Linter.Config` means a flat config in ESLint 9's bundled types but an
 * eslintrc config in `@types/eslint` for ESLint 8, so importing it would tie the
 * plugin's types to whichever major the consumer happens to have installed.
 */

declare namespace prototypePollution {
    type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;

    /** Every rule in this plugin accepts an optional custom error message. */
    interface RuleOptions {
        customMessage?: string;
    }

    type RuleEntry = RuleSeverity | [RuleSeverity] | [RuleSeverity, RuleOptions];

    type RulesRecord = Record<string, RuleEntry>;

    /** Structural match for ESLint's `Rule.RuleModule`, loose on purpose. */
    interface RuleModule {
        meta: {
            type?: string;
            docs?: Record<string, unknown>;
            messages?: Record<string, string>;
            schema?: unknown;
            hasSuggestions?: boolean;
            [key: string]: unknown;
        };
        create(context: any): Record<string, (...args: any[]) => void>;
    }

    type RuleName =
        | "no-bracket-notation-property-accessor"
        | "no-unsafe-object-assign";

    /**
     * A config for `eslint.config.js` (ESLint 9, and ESLint 8.21+ with flat
     * config enabled). Registers the plugin itself, so it can be spread
     * straight into the exported array.
     */
    interface FlatConfig {
        readonly name: string;
        readonly plugins: { readonly "prototype-pollution": Plugin };
        readonly rules: RulesRecord;
    }

    /**
     * A config for `.eslintrc`, `.eslintrc.js` or `.eslintrc.json` (ESLint 8 and
     * below). Reach it through `extends: ["plugin:prototype-pollution/recommended-legacy"]`
     * rather than importing it.
     */
    interface LegacyConfig {
        readonly plugins: readonly string[];
        readonly rules: RulesRecord;
    }

    interface Plugin {
        readonly meta: {
            readonly name: string;
            readonly version: string;
        };
        readonly rules: Readonly<Record<RuleName, RuleModule>>;
        readonly configs: {
            /** Flat config. */
            readonly recommended: FlatConfig;
            /** Flat config, explicit alias of `recommended`. */
            readonly "flat/recommended": FlatConfig;
            /** eslintrc config. */
            readonly "recommended-legacy": LegacyConfig;
        };
    }
}

declare const prototypePollution: prototypePollution.Plugin;

export = prototypePollution;

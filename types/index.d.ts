// Self-contained on purpose: `Linter.Config` is a flat config in ESLint 9's own types but
// an eslintrc config in `@types/eslint` for v8, so importing it would skew per consumer.

declare namespace prototypePollution {
    type RuleSeverity = "off" | "warn" | "error" | 0 | 1 | 2;

    interface RuleOptions {
        customMessage?: string;
    }

    type RuleEntry = RuleSeverity | [RuleSeverity] | [RuleSeverity, RuleOptions];

    type RulesRecord = Record<string, RuleEntry>;

    // Loose on purpose, so it stays assignable to ESLint's own Rule.RuleModule.
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

    interface FlatConfig {
        readonly name: string;
        readonly plugins: { readonly "prototype-pollution": Plugin };
        readonly rules: RulesRecord;
    }

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

// Self-contained: `eslint` is only a peer dependency, so these types must not
// depend on its own types resolving.

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

    interface Plugin {
        readonly meta: {
            readonly name: string;
            readonly namespace: string;
            readonly version: string;
        };
        readonly rules: Readonly<Record<RuleName, RuleModule>>;
        readonly configs: {
            readonly recommended: FlatConfig;
        };
    }
}

declare const prototypePollution: prototypePollution.Plugin;

export = prototypePollution;

import type { Linter } from "eslint";

declare const prototypePollution: {
    readonly configs: {
        readonly recommended: { readonly rules: Readonly<Linter.RulesRecord> };
    };
};

export = prototypePollution;

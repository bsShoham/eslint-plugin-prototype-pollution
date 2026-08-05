"use strict";

const assert = require("assert");
const { FlatESLint, LegacyESLint, major, version, supportsEslintrc, pkgName } = require("../helpers/eslint");
const plugin = require("../../lib");

const UNSAFE_CODE = "Object.assign(target, source);\nvar value = obj[key];\n";

const RULE_ASSIGN = "prototype-pollution/no-unsafe-object-assign";
const RULE_BRACKET = "prototype-pollution/no-bracket-notation-property-accessor";

async function lint(engine, code) {
    const results = await engine.lintText(code, { filePath: "input.js" });
    return results[0] ? results[0].messages : [];
}

function ruleIds(messages) {
    return messages.map((message) => message.ruleId).sort();
}

describe(`integration (eslint ${version})`, function () {
    describe("flat config (eslint.config.js)", function () {
        it("reports both rules via configs.recommended", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs.recommended]
            });
            assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), [RULE_BRACKET, RULE_ASSIGN].sort());
        });

        it("reports both rules via the flat/recommended alias", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs["flat/recommended"]]
            });
            assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), [RULE_BRACKET, RULE_ASSIGN].sort());
        });

        it("defaults the recommended rules to warnings, not errors", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs.recommended]
            });
            const messages = await lint(engine, UNSAFE_CODE);
            assert.ok(messages.length > 0, "expected warnings");
            assert.ok(messages.every((message) => message.severity === 1), "expected severity 1");
        });

        it("registers rules for manual configuration without the recommended config", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [{
                    plugins: { "prototype-pollution": plugin },
                    rules: { [RULE_ASSIGN]: "error", [RULE_BRACKET]: "off" }
                }]
            });
            const messages = await lint(engine, UNSAFE_CODE);
            assert.deepStrictEqual(ruleIds(messages), [RULE_ASSIGN]);
            assert.strictEqual(messages[0].severity, 2);
        });

        it("honours the customMessage option", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [{
                    plugins: { "prototype-pollution": plugin },
                    rules: { [RULE_BRACKET]: ["error", { customMessage: "custom flat message" }] }
                }]
            });
            const messages = await lint(engine, "var value = obj[key];");
            assert.strictEqual(messages[0].message, "custom flat message");
        });

        it("offers the Object.assign suggestion", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs.recommended]
            });
            const messages = await lint(engine, "Object.assign(target, source);");
            assert.strictEqual(messages[0].suggestions.length, 1);
            assert.strictEqual(messages[0].suggestions[0].fix.text, "{}, ");
        });
    });

    (supportsEslintrc ? describe : describe.skip)("eslintrc config (.eslintrc / .eslintrc.js / .eslintrc.json)", function () {
        // Registering here is what makes the string `extends` below resolve.
        function createEngine(overrideConfig) {
            return new LegacyESLint({
                useEslintrc: false,
                plugins: { "prototype-pollution": plugin },
                overrideConfig
            });
        }

        it('reports both rules via extends "plugin:prototype-pollution/recommended-legacy"', async function () {
            const engine = createEngine({ extends: ["plugin:prototype-pollution/recommended-legacy"] });
            assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), [RULE_BRACKET, RULE_ASSIGN].sort());
        });

        it("registers rules for manual configuration via the plugins array", async function () {
            const engine = createEngine({
                plugins: ["prototype-pollution"],
                rules: { [RULE_ASSIGN]: "error", [RULE_BRACKET]: "off" }
            });
            const messages = await lint(engine, UNSAFE_CODE);
            assert.deepStrictEqual(ruleIds(messages), [RULE_ASSIGN]);
            assert.strictEqual(messages[0].severity, 2);
        });

        it("honours the customMessage option", async function () {
            const engine = createEngine({
                plugins: ["prototype-pollution"],
                rules: { [RULE_BRACKET]: ["error", { customMessage: "custom legacy message" }] }
            });
            const messages = await lint(engine, "var value = obj[key];");
            assert.strictEqual(messages[0].message, "custom legacy message");
        });

        it("lets a local rules override win over the extended config", async function () {
            const engine = createEngine({
                extends: ["plugin:prototype-pollution/recommended-legacy"],
                rules: { [RULE_BRACKET]: "off" }
            });
            assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), [RULE_ASSIGN]);
        });
    });

    describe("config object shapes", function () {
        it("exposes every documented config name", function () {
            assert.deepStrictEqual(Object.keys(plugin.configs).sort(), [
                "flat/recommended",
                "recommended",
                "recommended-legacy"
            ]);
        });

        it("gives every eslintrc-facing config a slash-free name", function () {
            for (const [name, config] of Object.entries(plugin.configs)) {
                if (Array.isArray(config.plugins)) {
                    assert.ok(!name.includes("/"), `eslintrc config "${name}" must not contain a slash`);
                }
            }
        });

        it("gives the legacy config an eslintrc-shaped plugins array", function () {
            const legacy = plugin.configs["recommended-legacy"];
            assert.ok(Array.isArray(legacy.plugins));
            assert.deepStrictEqual(legacy.plugins, ["prototype-pollution"]);
            assert.ok(!("name" in legacy), "legacy config must not carry a flat-config name");
        });

        it("gives the flat config a plugins object that self-registers", function () {
            const flat = plugin.configs.recommended;
            assert.strictEqual(typeof flat.plugins, "object");
            assert.ok(!Array.isArray(flat.plugins));
            assert.strictEqual(flat.plugins["prototype-pollution"], plugin);
        });

        it("does not share a mutable rules object between the two configs", function () {
            assert.notStrictEqual(
                plugin.configs.recommended.rules,
                plugin.configs["recommended-legacy"].rules
            );
            assert.deepStrictEqual(
                plugin.configs.recommended.rules,
                plugin.configs["recommended-legacy"].rules
            );
        });

        it("keeps the plugin name short and matching the rule prefix", function () {
            assert.strictEqual(plugin.meta.name, "prototype-pollution");
            assert.strictEqual(typeof plugin.meta.version, "string");
        });

        it("exports both rules with the names the configs reference", function () {
            assert.deepStrictEqual(Object.keys(plugin.rules).sort(), [
                "no-bracket-notation-property-accessor",
                "no-unsafe-object-assign"
            ]);
            for (const config of Object.values(plugin.configs)) {
                for (const ruleId of Object.keys(config.rules)) {
                    const ruleName = ruleId.replace("prototype-pollution/", "");
                    assert.ok(plugin.rules[ruleName], `${ruleId} has no matching rule`);
                }
            }
        });
    });

    describe("rule robustness under a real lint run", function () {
        it("does not crash on argument-less Object.assign", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs.recommended]
            });
            const messages = await lint(engine, "Object.assign();");
            assert.ok(!messages.some((message) => message.fatal), "unexpected fatal error");
        });

        it("does not crash resolving a non-Identifier object", async function () {
            const engine = new FlatESLint({
                overrideConfigFile: true,
                overrideConfig: [plugin.configs.recommended]
            });
            const messages = await lint(engine, "foo().bar[key]; this.x[key]; a.b.c[key];");
            assert.ok(!messages.some((message) => message.fatal), "unexpected fatal error");
            assert.strictEqual(messages.length, 3);
        });
    });

    (supportsEslintrc ? describe : describe.skip)("cross-system safety net", function () {
        it("rejects the flat config when passed to eslintrc, rather than silently doing nothing", function () {
            // eslintrc validates eagerly, in the constructor.
            assert.throws(
                () => new LegacyESLint({
                    useEslintrc: false,
                    plugins: { "prototype-pollution": plugin },
                    overrideConfig: { extends: ["plugin:prototype-pollution/recommended"] }
                }),
                /invalid|Unexpected top-level property/i,
                "expected a loud failure so users know to use recommended-legacy"
            );
        });
    });

    if (major === 9) {
        describe("eslint 9 specifics", function () {
            it("keeps eslintrc working for users who have not migrated yet", async function () {
                const engine = new LegacyESLint({
                    useEslintrc: false,
                    plugins: { "prototype-pollution": plugin },
                    overrideConfig: { extends: ["plugin:prototype-pollution/recommended-legacy"] }
                });
                assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), [RULE_BRACKET, RULE_ASSIGN].sort());
            });
        });
    }

    if (major >= 10) {
        describe("eslint 10 specifics", function () {
            it("confirms the eslintrc engine really is gone, so the skips above are honest", function () {
                const unsafe = require(pkgName + "/use-at-your-own-risk");
                assert.strictEqual(unsafe.LegacyESLint, undefined);
                assert.strictEqual(unsafe.FlatESLint, undefined);
                assert.strictEqual(LegacyESLint, null);
            });

            it("still exports recommended-legacy for ESLint 8 and 9 consumers", function () {
                const legacy = plugin.configs["recommended-legacy"];
                assert.ok(Array.isArray(legacy.plugins));
                assert.deepStrictEqual(Object.keys(legacy.rules).sort(), [RULE_BRACKET, RULE_ASSIGN].sort());
            });

            it("reports through the flat config with no deprecation warnings", async function () {
                const engine = new FlatESLint({
                    overrideConfigFile: true,
                    overrideConfig: [plugin.configs.recommended]
                });
                const results = await engine.lintText(UNSAFE_CODE, { filePath: "input.js" });
                assert.deepStrictEqual(ruleIds(results[0].messages), [RULE_BRACKET, RULE_ASSIGN].sort());
                assert.deepStrictEqual(results[0].usedDeprecatedRules || [], []);
            });
        });
    }
});

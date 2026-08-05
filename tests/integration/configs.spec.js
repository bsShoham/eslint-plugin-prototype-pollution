"use strict";

const assert = require("assert");
const { ESLint, version, pkgName } = require("../helpers/eslint");
const plugin = require("../../lib");

const UNSAFE_CODE = "Object.assign(target, source);\nvar value = obj[key];\n";

const RULE_ASSIGN = "prototype-pollution/no-unsafe-object-assign";
const RULE_BRACKET = "prototype-pollution/no-bracket-notation-property-accessor";
const BOTH_RULES = [RULE_BRACKET, RULE_ASSIGN].sort();

function createEngine(overrideConfig) {
    return new ESLint({ overrideConfigFile: true, overrideConfig });
}

async function lint(engine, code) {
    const results = await engine.lintText(code, { filePath: "input.js" });
    return results[0] ? results[0].messages : [];
}

function ruleIds(messages) {
    return messages.map((message) => message.ruleId).sort();
}

describe(`integration (eslint ${version})`, function () {
    it("reports both rules via configs.recommended", async function () {
        const engine = createEngine([plugin.configs.recommended]);
        assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), BOTH_RULES);
    });

    it("defaults the recommended rules to warnings, not errors", async function () {
        const engine = createEngine([plugin.configs.recommended]);
        const messages = await lint(engine, UNSAFE_CODE);
        assert.ok(messages.length > 0, "expected warnings");
        assert.ok(messages.every((message) => message.severity === 1), "expected severity 1");
    });

    it("registers rules for manual configuration without the recommended config", async function () {
        const engine = createEngine([{
            plugins: { "prototype-pollution": plugin },
            rules: { [RULE_ASSIGN]: "error", [RULE_BRACKET]: "off" }
        }]);
        const messages = await lint(engine, UNSAFE_CODE);
        assert.deepStrictEqual(ruleIds(messages), [RULE_ASSIGN]);
        assert.strictEqual(messages[0].severity, 2);
    });

    it("honours the customMessage option", async function () {
        const engine = createEngine([{
            plugins: { "prototype-pollution": plugin },
            rules: { [RULE_BRACKET]: ["error", { customMessage: "custom flat message" }] }
        }]);
        const messages = await lint(engine, "var value = obj[key];");
        assert.strictEqual(messages[0].message, "custom flat message");
    });

    it("offers the Object.assign suggestion", async function () {
        const engine = createEngine([plugin.configs.recommended]);
        const messages = await lint(engine, "Object.assign(target, source);");
        assert.strictEqual(messages[0].suggestions.length, 1);
        assert.strictEqual(messages[0].suggestions[0].fix.text, "{}, ");
    });

    it("reports without triggering any rule deprecation warnings", async function () {
        const engine = createEngine([plugin.configs.recommended]);
        const results = await engine.lintText(UNSAFE_CODE, { filePath: "input.js" });
        assert.deepStrictEqual(ruleIds(results[0].messages), BOTH_RULES);
        assert.deepStrictEqual(results[0].usedDeprecatedRules || [], []);
    });

    describe("config object shapes", function () {
        it("exposes every documented config name", function () {
            assert.deepStrictEqual(Object.keys(plugin.configs), ["recommended"]);
        });

        it("gives the flat config a plugins object that self-registers", function () {
            const flat = plugin.configs.recommended;
            assert.strictEqual(typeof flat.plugins, "object");
            assert.ok(!Array.isArray(flat.plugins));
            assert.strictEqual(flat.plugins["prototype-pollution"], plugin);
        });

        it("names itself after the package and namespaces itself after the rule prefix", function () {
            assert.strictEqual(plugin.meta.name, "eslint-plugin-prototype-pollution");
            assert.strictEqual(plugin.meta.namespace, "prototype-pollution");
            assert.strictEqual(typeof plugin.meta.version, "string");
        });

        it("namespaces itself with the prefix every recommended rule uses", function () {
            for (const ruleId of Object.keys(plugin.configs.recommended.rules)) {
                assert.strictEqual(ruleId.split("/")[0], plugin.meta.namespace);
            }
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

    describe("meta.namespace", function () {
        // defineConfig landed in ESLint 9.22; on 9.0-9.21 the remapping is inert.
        const { defineConfig } = require(pkgName + "/config");

        it("remaps rule IDs when a consumer registers the plugin under another key", async function () {
            const engine = createEngine(defineConfig([{
                files: ["**/*.js"],
                plugins: { pp: plugin },
                extends: ["pp/recommended"]
            }]));
            assert.deepStrictEqual(
                ruleIds(await lint(engine, UNSAFE_CODE)),
                ["pp/no-bracket-notation-property-accessor", "pp/no-unsafe-object-assign"]
            );
        });

        it("still uses the default prefix when registered under it", async function () {
            const engine = createEngine(defineConfig([{
                files: ["**/*.js"],
                plugins: { "prototype-pollution": plugin },
                extends: ["prototype-pollution/recommended"]
            }]));
            assert.deepStrictEqual(ruleIds(await lint(engine, UNSAFE_CODE)), BOTH_RULES);
        });
    });

    describe("rule robustness under a real lint run", function () {
        it("does not crash on argument-less Object.assign", async function () {
            const engine = createEngine([plugin.configs.recommended]);
            const messages = await lint(engine, "Object.assign();");
            assert.ok(!messages.some((message) => message.fatal), "unexpected fatal error");
        });

        it("does not crash resolving a non-Identifier object", async function () {
            const engine = createEngine([plugin.configs.recommended]);
            const messages = await lint(engine, "foo().bar[key]; this.x[key]; a.b.c[key];");
            assert.ok(!messages.some((message) => message.fatal), "unexpected fatal error");
            assert.strictEqual(messages.length, 3);
        });
    });
});

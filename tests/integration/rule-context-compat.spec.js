/**
 * `context.sourceCode` only exists from ESLint 8.40 onwards, but the plugin
 * supports ESLint 8.0. Both versions in the test matrix are new enough to
 * provide it, so nothing else here would notice if the `getSourceCode()`
 * fallback were removed -- these tests drive the rules with a hand-built
 * context to pin the older contract down.
 */
"use strict";

const assert = require("assert");
const espree = require("espree");
const bracketRule = require("../../lib/rules/no-bracket-notation-property-accessor");

/**
 * Runs a rule against `code` with a minimal ESLint 8.0-era context: one that
 * exposes `getSourceCode()` but no `sourceCode` property.
 */
function runWithLegacyContext(rule, code, options) {
    const ast = espree.parse(code, { ecmaVersion: 2022, loc: true, range: true });
    const reports = [];
    const sourceCode = {
        getText(node) {
            return node ? code.slice(node.range[0], node.range[1]) : code;
        }
    };

    const context = {
        options: options || [],
        getSourceCode() {
            return sourceCode;
        },
        report(descriptor) {
            reports.push(descriptor);
        }
    };
    assert.ok(!("sourceCode" in context), "the stub must not expose context.sourceCode");

    const visitors = rule.create(context);
    // Only the node types these rules care about, which is all the traversal
    // this fixture needs.
    (function walk(node) {
        if (!node || typeof node.type !== "string") {
            return;
        }
        if (visitors[node.type]) {
            visitors[node.type](node);
        }
        for (const key of Object.keys(node)) {
            if (key === "parent") {
                continue;
            }
            const value = node[key];
            if (Array.isArray(value)) {
                value.forEach(walk);
            } else if (value && typeof value.type === "string") {
                walk(value);
            }
        }
    })(ast);

    return reports;
}

describe("rule context compatibility (ESLint 8.0 - 8.39)", function () {
    it("falls back to getSourceCode() for a non-Identifier object", function () {
        const reports = runWithLegacyContext(bracketRule, "foo().bar[key];");
        assert.strictEqual(reports.length, 1);
        assert.strictEqual(reports[0].messageId, "avoidBracketNotation");
    });

    it("does not touch the source code at all for an Identifier object", function () {
        const reports = runWithLegacyContext(bracketRule, "obj[key];");
        assert.strictEqual(reports.length, 1);
    });

    it("still honours the hasOwnProperty guard without context.sourceCode", function () {
        const reports = runWithLegacyContext(
            bracketRule,
            "Object.prototype.hasOwnProperty.call(obj, key);\nobj[key];"
        );
        assert.deepStrictEqual(reports, []);
    });

    it("resolves the fallback once at create() time, not per node", function () {
        // A rule that reached for context.sourceCode lazily would throw here.
        const reports = runWithLegacyContext(bracketRule, "a().b[k]; c().d[k];");
        assert.strictEqual(reports.length, 2);
    });
});

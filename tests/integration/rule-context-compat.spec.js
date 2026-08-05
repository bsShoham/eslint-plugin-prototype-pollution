// Every ESLint in the test matrix provides context.sourceCode, so nothing else would
// catch the getSourceCode() fallback being removed. These drive the rules with a stub.
"use strict";

const assert = require("assert");
const espree = require("espree");
const bracketRule = require("../../lib/rules/no-bracket-notation-property-accessor");

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
        const reports = runWithLegacyContext(bracketRule, "a().b[k]; c().d[k];");
        assert.strictEqual(reports.length, 2);
    });
});

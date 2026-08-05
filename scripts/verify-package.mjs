// Packs the plugin and consumes it the way a real user would, on every supported
// ESLint major. Catches breakage that the in-repo suite cannot: a bad `files`
// list, a missing runtime dependency, or a config that only resolves when the
// plugin is required by relative path rather than by its published name.
//
// Run: node scripts/verify-package.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ESLINT_MAJORS = ["9", "10"];
const PKG = "eslint-plugin-prototype-pollution";
const PREFIX = "prototype-pollution";

const UNSAFE_CODE = "Object.assign(target, source);\nvar value = obj[key];\n";
const EXPECTED_RULES = [
    `${PREFIX}/no-bracket-notation-property-accessor`,
    `${PREFIX}/no-unsafe-object-assign`
];

const FLAT_CJS = `const p = require("${PKG}");\nmodule.exports = [p.configs.recommended];\n`;
const FLAT_ESM = `import p from "${PKG}";\nexport default [p.configs.recommended];\n`;
const ESLINTRC = `{ "root": true, "extends": ["plugin:${PREFIX}/recommended"] }\n`;

const failures = [];

function run(cmd, args, cwd) {
    return execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function check(label, condition, detail) {
    if (condition) {
        console.log(`  PASS  ${label}`);
    } else {
        console.log(`  FAIL  ${label}\n        ${detail}`);
        failures.push(label);
    }
}

// --- pack, and assert the tarball's shape -----------------------------------
const repoRoot = process.cwd();
const packDir = mkdtempSync(join(tmpdir(), "pp-pack-"));
const tarball = join(packDir, JSON.parse(run("npm", ["pack", "--json", "--pack-destination", packDir], repoRoot))[0].filename);

const manifest = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"));
console.log(`\npackaged ${PKG}@${manifest.version}`);
check(
    "no runtime dependencies",
    Object.keys(manifest.dependencies ?? {}).length === 0,
    `found ${JSON.stringify(manifest.dependencies)}`
);

const entries = run("tar", ["-tzf", tarball], repoRoot).trim().split("\n").sort();
const leaked = entries.filter((e) => /^package\/(tests|scripts|\.github|eslint\.config)/.test(e));
check("tarball excludes tests and dev configs", leaked.length === 0, `leaked: ${leaked.join(", ")}`);

// --- consume it, per ESLint major -------------------------------------------
for (const major of ESLINT_MAJORS) {
    console.log(`\neslint ${major}`);
    const dir = mkdtempSync(join(tmpdir(), `pp-consume-${major}-`));
    try {
        writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "fixture", private: true, version: "0.0.0" }));
        run("npm", ["install", "--no-audit", "--no-fund", tarball, `eslint@${major}`], dir);

        const installed = JSON.parse(readFileSync(join(dir, "node_modules/eslint/package.json"), "utf8")).version;
        console.log(`  installed eslint ${installed}`);

        writeFileSync(join(dir, "target.js"), UNSAFE_CODE);

        for (const [label, file, contents] of [
            ["flat config (CJS)", "eslint.config.js", FLAT_CJS],
            ["flat config (ESM)", "eslint.config.mjs", FLAT_ESM]
        ]) {
            writeFileSync(join(dir, file), contents);
            let json;
            try {
                json = run("npx", ["eslint", "--config", file, "--format", "json", "target.js"], dir);
            } catch (err) {
                // eslint exits non-zero when it reports problems; stdout still holds the JSON.
                json = err.stdout;
            }
            const ids = JSON.parse(json)[0].messages.map((m) => m.ruleId).sort();
            check(label, JSON.stringify(ids) === JSON.stringify(EXPECTED_RULES), `got ${JSON.stringify(ids)}`);
            rmSync(join(dir, file));
        }

        // eslintrc must not be silently honored on either major: v1 ships no
        // legacy config, and ESLint 10 removed the system outright.
        writeFileSync(join(dir, ".eslintrc.json"), ESLINTRC);
        let honored = false;
        try {
            run("npx", ["eslint", "target.js"], dir);
            honored = true;
        } catch {
            honored = false;
        }
        check("eslintrc is not honored", !honored, "an .eslintrc.json config was accepted");
        rmSync(join(dir, ".eslintrc.json"));
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
}

rmSync(packDir, { recursive: true, force: true });

console.log(failures.length ? `\n${failures.length} check(s) failed\n` : "\nall checks passed\n");
process.exitCode = failures.length ? 1 : 0;

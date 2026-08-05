# eslint-plugin-prototype-pollution

Detects the existence of possible prototype pollution vulnerabilities.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
# npm
npm i eslint --save-dev

# yarn
yarn add eslint --dev
```

Next, install `eslint-plugin-prototype-pollution`:

```sh
# npm
npm install eslint-plugin-prototype-pollution --save-dev

# yarn
yarn add eslint-plugin-prototype-pollution --dev
```


## Compatibility

Requires **ESLint 8, 9 or 10**. Every combination below is covered by the test
suite, which runs against all three majors.

| ESLint | Flat config (`eslint.config.js`) | eslintrc (`.eslintrc*`) |
| :--- | :--- | :--- |
| 10 | ✅ `recommended` | ❌ removed from ESLint itself |
| 9 | ✅ `recommended` (default) | ✅ `recommended-legacy`, via `ESLINT_USE_FLAT_CONFIG=false` |
| 8 | ✅ `recommended` (8.21+, via `ESLINT_USE_FLAT_CONFIG=true`) | ✅ `recommended-legacy` (default) |

Pick the config that matches the system you use — they are not interchangeable,
because ESLint changed the shape of a config object between them:

| Your config file | Config system | Use this config |
| :--- | :--- | :--- |
| `eslint.config.js` / `.mjs` / `.cjs` | flat | `recommended` (alias: `flat/recommended`) |
| `.eslintrc`, `.eslintrc.js`, `.eslintrc.json`, `.eslintrc.yml` | eslintrc | `recommended-legacy` |

Using the wrong one is not silent: passing the flat `recommended` config to an
eslintrc `extends` fails with `Unexpected top-level property "name"`. If you see
that, switch to `recommended-legacy`.

### A note on ESLint 10

ESLint 10 deleted the eslintrc config system, so `.eslintrc*` files are not read
at all and `ESLINT_USE_FLAT_CONFIG=false` no longer does anything. This is an
ESLint change, not a plugin limitation — if you are on ESLint 10 you must use
flat config. `recommended-legacy` is still exported for anyone on ESLint 8 or 9.

ESLint 10 also requires Node `^20.19.0 || ^22.13.0 || >=24`.

## Usage

### Flat config (`eslint.config.js`)

The recommended config registers the plugin itself, so you only need to spread it
in:

```js
const prototypePollution = require("eslint-plugin-prototype-pollution");

module.exports = [
    prototypePollution.configs.recommended,
];
```

Or with ES modules (`eslint.config.mjs`):

```js
import prototypePollution from "eslint-plugin-prototype-pollution";

export default [
    prototypePollution.configs.recommended,
];
```

To choose rules and severities yourself, register the plugin and configure the
rules directly:

```js
const prototypePollution = require("eslint-plugin-prototype-pollution");

module.exports = [
    {
        plugins: { "prototype-pollution": prototypePollution },
        rules: {
            "prototype-pollution/no-bracket-notation-property-accessor": [
                "error",
                { customMessage: "Please add an Object.hasOwn(obj, prop) check" },
            ],
            "prototype-pollution/no-unsafe-object-assign": "off",
        },
    },
];
```

### eslintrc config

For `.eslintrc*` config files (deprecated by ESLint, but still supported here).

#### Recommended

Extend the `recommended-legacy` config. This is the only thing you need — it
registers the plugin and turns both rules on:

```json
{
    "extends": [
        "plugin:prototype-pollution/recommended-legacy"
    ]
}
```

#### Custom configuration

Add `prototype-pollution` to the plugins section. You can omit the
`eslint-plugin-` prefix:

```json
{
    "plugins": [
        "prototype-pollution"
    ]
}
```

Then configure the rules you want under the rules section. Rule options are
passed as an object:

```json
{
    "rules": {
        "prototype-pollution/no-bracket-notation-property-accessor": [
            "error",
            { "customMessage": "Please add an Object.hasOwn(obj, prop) check" }
        ],
        "prototype-pollution/no-unsafe-object-assign": "off"
    }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Rules

All rules support a custom error message in the passed options.

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
🏛️ Set in the `recommended-legacy` configuration.\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                         | Description                                               | ⚠️    | 💡 |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :---- | :- |
| [no-bracket-notation-property-accessor](docs/rules/no-bracket-notation-property-accessor.md) | Detect unsafe usage of bracket notation property accessor | ✅ 🏛️ |    |
| [no-unsafe-object-assign](docs/rules/no-unsafe-object-assign.md)                             | Detect unsafe usage of Object.assign                      | ✅ 🏛️ | 💡 |

<!-- end auto-generated rules list -->

## License

MIT

(See [LICENSE](LICENSE))

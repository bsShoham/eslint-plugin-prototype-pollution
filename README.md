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

Requires **ESLint 9 or 10**, and **flat config** (`eslint.config.js`). Both majors
are covered by the test suite, which runs once per major.

| ESLint | Flat config (`eslint.config.js`) |
| :--- | :--- |
| 10 | ✅ `recommended` |
| 9 | ✅ `recommended` |

ESLint 10 requires Node `^20.19.0 || ^22.13.0 || >=24`; ESLint 9 requires Node
`^18.18.0 || ^20.9.0 || >=21.1.0`.

### Still on ESLint 8?

v0.2.0 is the last release supporting ESLint 8, including `.eslintrc*` config
files. Pin to it:

```json
{
    "devDependencies": {
        "eslint-plugin-prototype-pollution": "^0.2.0"
    }
}
```

For `0.x` versions npm treats `^` conservatively, so `^0.2.0` resolves to
`>=0.2.0 <0.3.0` — it picks up any 0.2.x patch release but will never upgrade you
to 1.0.0.

Prefer it over a looser range like `^0.x.x`, which resolves to `<1.0.0`. A fresh
install of either lands on 0.2.0, but `<1.0.0` also considers 0.1.x valid — so an
existing lockfile pinned to 0.1.8 satisfies it and will not be corrected, and
0.1.8 crashes on ESLint 8.0–8.39.

See the [v0.2.0 README](https://github.com/shoham-utila/eslint-plugin-prototype-pollution/blob/v0.2.0/README.md)
for eslintrc usage.

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

`defineConfig` works too, and lets you reference the config by name. It also
remaps rule IDs if you register the plugin under a different key, so
`plugins: { pp: prototypePollution }` reports `pp/no-unsafe-object-assign`:

```js
const prototypePollution = require("eslint-plugin-prototype-pollution");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
    {
        files: ["**/*.js"],
        plugins: { "prototype-pollution": prototypePollution },
        extends: ["prototype-pollution/recommended"],
    },
]);
```

`defineConfig` requires ESLint 9.22 or later; on earlier 9.x use the plain array
form above.

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Rules

All rules support a custom error message in the passed options.

<!-- begin auto-generated rules list -->

⚠️ Configurations set to warn in.\
✅ Set in the `recommended` configuration.\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                         | Description                                               | ⚠️ | 💡 |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :- | :- |
| [no-bracket-notation-property-accessor](docs/rules/no-bracket-notation-property-accessor.md) | Detect unsafe usage of bracket notation property accessor | ✅  |    |
| [no-unsafe-object-assign](docs/rules/no-unsafe-object-assign.md)                             | Detect unsafe usage of Object.assign                      | ✅  | 💡 |

<!-- end auto-generated rules list -->

## License

MIT

(See [LICENSE](LICENSE))

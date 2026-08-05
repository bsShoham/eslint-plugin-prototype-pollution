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

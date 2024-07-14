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


## Usage

### Flat config

For newer eslint versions you can add the following to your js config file (`eslint.config.js`)

```js
const pluginPrototypePollution = require("eslint-plugin-prototype-pollution");

module.exports = [pluginPrototypePollution.configs.recommended]
```

### eslintrc config

For the `.eslintrc` config files do the following (deprecated and will be removed in the future)

#### Recommended

Instead of applying rules manually, you can also use our recommended config by adding to the configuration file at the extend section the following:

```json
{
    "extends": [
        "plugin:prototype-pollution/recommended-legacy"
    ]
}
```

#### Custom configuration

Add `prototype-pollution` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "prototype-pollution"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "prototype-pollution/no-bracket-notation-property-accessor": ["error", "Please add a obj.hasOwn(property) check"],
        "prototype-pollution/no-unsafe-object-assign": "off"
    }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Rules

All rules support a custom error message in the passed options.

<!-- begin auto-generated rules list -->

💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                                         | Description                                               | 💡 |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :- |
| [no-bracket-notation-property-accessor](docs/rules/no-bracket-notation-property-accessor.md) | Detect unsafe usage of bracket notation property accessor |    |
| [no-unsafe-object-assign](docs/rules/no-unsafe-object-assign.md)                             | Detect unsafe usage of Object.assign                      | 💡 |

<!-- end auto-generated rules list -->

## License

MIT

(See [LICENSE](LICENSE))

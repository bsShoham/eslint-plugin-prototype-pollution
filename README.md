# eslint-plugin-prototype-pollution

Detect the use of prototype pollution vulnerabilities

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-prototype-pollution`:

```sh
npm install eslint-plugin-prototype-pollution --save-dev
```

## Usage

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
        "prototype-pollution/rule-name": 2
    }
}
```



## Configurations

<!-- begin auto-generated configs list -->

|    | Name          |
| :- | :------------ |
| ✅  | `recommended` |

<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->

💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                                         | Description                                               | 💡 |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------------- | :- |
| [no-bracket-notation-property-accessor](docs/rules/no-bracket-notation-property-accessor.md) | Detect unsafe usage of bracket notation property accessor |    |
| [no-unsafe-object-assign](docs/rules/no-unsafe-object-assign.md)                             | Detect unsafe usage of Object.assign                      | 💡 |

<!-- end auto-generated rules list -->



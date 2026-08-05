# Contributing to eslint-plugin-prototype-pollution

We welcome contributions to this plugin, including pull requests and issues
reporting problems and suggesting new features.

## Code of Conduct

Though not an official part of the project, I'd like us to follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## Issues

Please file issues for any problems you find or features you'd like to see.

## Development

Please open an issue before starting work on a pull request. This will help us
to provide feedback on your contribution and let you know if there are others
working on the same thing.

If you add a new rule, please remember to add tests to it. If you're not sure
how to do that, please ask and I'll be happy to help.

### Running the tests

The plugin supports ESLint 8, 9 and 10, and both of ESLint's config systems, so
the suite runs once per major:

```sh
npm test               # all three majors
npm run test:eslint8   # the `eslint8` alias  (npm:eslint@^8)
npm run test:eslint9   # the `eslint` devDependency (v9)
npm run test:eslint10  # the `eslint10` alias (npm:eslint@^10)
```

ESLint 8 and 10 are installed under version-suffixed aliases so all three majors
can live in `node_modules` at once. Tests must never `require("eslint")`
directly — use `tests/helpers/eslint.js`, which resolves whichever version is
under test and exposes the engines under stable names.

Two things that differ per major, both already handled by the helper:

- **ESLint 10 removed the eslintrc system.** `LegacyESLint` does not exist there,
  so the helper exports `supportsEslintrc` and the eslintrc suites skip on 10.
  Do not add an eslintrc test without that guard.
- **ESLint 10's RuleTester rejects the `type` error property.** Assert
  `column`/`endColumn` instead — it pins the reported node more precisely and
  works on all three majors.

`tests/integration/configs.spec.js` loads the exported configs through a real
ESLint instance in both config systems. If you touch `lib/index.js`, that is the
file that will tell you whether you broke one of them.

Two more checks worth knowing about:

```sh
npm run lint        # eslint + the types check + the docs check
npm run lint:types  # typechecks types/index.d.ts against tests/types/usage.ts
```

`types/index.d.ts` intentionally does not import from `eslint`, because
`Linter.Config` means a flat config in ESLint 9's types and an eslintrc config in
`@types/eslint` for ESLint 8. Keep it self-contained.

We work on the main branch, so please base your pull requests there. We aim to follow
[semantic versioning](https://semver.org/) and will release new versions as
needed.

## Personal note

I'm not a security expert, and I'm not a JavaScript expert. I'm just a developer, like you, who wants to make the world a better place. I'm happy to accept your contributions. I'm learning as I go, and I'm happy to learn from you.
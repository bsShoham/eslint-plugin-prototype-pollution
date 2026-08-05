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

The plugin supports ESLint 9 and 10, flat config only, so the suite runs once per
major:

```sh
npm test               # both majors
npm run test:eslint9   # the `eslint9` alias (npm:eslint@^9)
npm run test:eslint10  # the `eslint` devDependency (v10)
```

ESLint 9 is installed under a version-suffixed alias so both majors can live in
`node_modules` at once. Tests must never `require("eslint")` directly — use
`tests/helpers/eslint.js`, which resolves whichever version is under test.

`tests/integration/configs.spec.js` loads the exported config through a real
ESLint instance. If you touch `lib/index.js`, that is the file that will tell you
whether you broke it.

Two more checks worth knowing about:

```sh
npm run lint        # eslint + the types check + the docs check
npm run lint:types  # typechecks types/index.d.ts against tests/types/usage.ts
```

`types/index.d.ts` intentionally does not import from `eslint`. Because `eslint`
is only a peer dependency, these types must not depend on its own types being
resolvable in the consumer's project. Keep it self-contained.

We work on the main branch, so please base your pull requests there. We aim to follow
[semantic versioning](https://semver.org/) and will release new versions as
needed.

## Personal note

I'm not a security expert, and I'm not a JavaScript expert. I'm just a developer, like you, who wants to make the world a better place. I'm happy to accept your contributions. I'm learning as I go, and I'm happy to learn from you.
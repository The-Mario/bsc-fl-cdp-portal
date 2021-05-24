# ui-components

[![Build Status](https://travis-ci.com/makerdao/ui-components.svg?token=86iztpXqAPVUhbXad8ub&branch=master)](https://travis-ci.com/makerdao/ui-components)

MakerDAO UI components for use with React and styled-components.

## Getting started

There are three parts to this repository:

1. The components themselves, found at `src/components`
2. The [React Storybook](https://github.com/storybooks/storybook]) stories, found at `stories/index.stories.js`. This is primarily available to provide a hot-reloading development and testing environment. It is _not_ the main source of documentation for these components!
3. Component documentation, in `documentation/`, provided by docz.

### Local Development

```
yarn
yarn run develop // starts the storybook dev environment

// These commands are also run every commit, but you can run them manually if you want
yarn run build:es // builds an esmodules version of components and styles, and puts them in `dist/`, ready to be published.
yarn run build:cjs // builds a cjs version of components and styles, and puts them in `dist/`, ready to be published.
```

### Working with local version of ui-components in other repositories

When using a local version of ui-components in other repositories (using `yarn link @makerdao/ui-components-core` or otherwise), it's a bit inconvenient to manually build the components each time!

Fortunately, rollup supports `watch`, which you can use via `BABEL_ENV=es yarn run watch`, specifying the build you want using the BABEL_ENV environment variable. (Use `cjs` for a cjs build)

### Publishing

```
yarn run publish
```

## Continuous deployment

Travis automatically builds a new version of the documentation at https://makerdao.com/ui-components whenever there are changes pushed to master.

## Resources

- React
- React Storybook
- styled-components
- styled-system
- Rollup
- Docz

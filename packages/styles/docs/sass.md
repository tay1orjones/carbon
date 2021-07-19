# `@carbon/styles`

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
  - [Files](#files)
- [Breakpoint](#breakpoint)
- [Colors](#colors)
- [Config](#config)
- [Feature Flags](#feature-flags)
- [Grid](#grid)
  - [Using the grid](#using-the-grid)
  - [Classes provided](#classes-provided)
  - [Grid Mixins](#grid-mixins)
- [Motion](#motion)
- [Reset](#reset)
- [Spacing](#spacing)
- [Theming](#theming)
- [Type](#type)
- [Components](#components)
- [Utilities](#utilities)
- [Configuration](#configuration)
  - [`sass-loader`](#sass-loader)
  - [Parcel](#parcel)
  - [Vite](#vite)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

The `@carbon/styles` package provides the Sass files needed to include every
style for the Carbon Design System. It includes entrypoints for themes, tokens,
CSS helpers, components, and more.

### Files

The following is a table of all files that are available to use. While there may
be additional files that you can import from directly within the package, these
are the public entrypoints that are maintained and follow semantic versioning
between version updates.

| File                                   | Description                                                |
| :------------------------------------- | :--------------------------------------------------------- |
| [`scss/breakpoint`](#breakpoint)       | Helper functions and mixins for working with breakpoints   |
| [`scss/colors`](#colors)               | Access colors from every swatch in the IBM Design Language |
| [`scss/config`](#config)               | Configure various options for the package                  |
| [`scss/feature-flags`](#feature-flags) | Configure various feature flags for experiments            |
| [`scss/grid`](#grid)                   | Access and use the CSS Grid built-in to Carbon             |
| [`scss/motion`](#motion)               | Helper function, mixins, and tokens for motion             |
| [`scss/reset`](#reset)                 | A CSS Reset                                                |
| [`scss/spacing`](#spacing)             | Variables for the spacing scale                            |
| [`scss/theme`](#theming)               | Tokens for the current theme                               |
| [`scss/themes`](#theming)              | Reference the default themes from the Carbon Design System |
| [`scss/type`](#type)                   | Type tokens and helpers                                    |
| [`scss/components/`](#components)      | A directory containing component styles                    |
| [`scss/utilities/`](#utilities)        | A directory containing common CSS utilities                |

## Breakpoint

| Import                                   | Filepath                |
| :--------------------------------------- | :---------------------- |
| `@use '@carbon/styles/scss/breakpoint';` | `scss/_breakpoint.scss` |

## Colors

| Import                               | Filepath            |
| :----------------------------------- | :------------------ |
| `@use '@carbon/styles/scss/colors';` | `scss/_colors.scss` |

## Config

| Import                               | Filepath            |
| :----------------------------------- | :------------------ |
| `@use '@carbon/styles/scss/config';` | `scss/_config.scss` |

## Feature Flags

| Import                                      | Filepath                   |
| :------------------------------------------ | :------------------------- |
| `@use '@carbon/styles/scss/feature-flags';` | `scss/_feature-flags.scss` |

## Grid

| Import                             | Filepath          |
| :--------------------------------- | :---------------- |
| `@use '@carbon/styles/scss/grid';` | `scss/_grid.scss` |

### Using the grid

This package `@forward`s the styles defined in the [`@carbon/grid`](https://github.com/carbon-design-system/carbon/tree/main/packages/grid) package. The full source for Carbon grid styles can be found there alongside more comprehensive documentation on package contents, configuration, and usage.

To use the grid via  `@carbon/styles`, it must be brought in directly or the grid specific style sheet must be imported:

```scss
/* All the grid styles are included through this central entrypoint */
@use '@carbon/styles';

/* Alternatively, the grid styles can be brought in on their own */
@use '@carbon/styles/scss/grid';
```

### Classes provided

In either case, you will then have access to the grid classes and mixins available to build with the grid. There are two primitive class types to use in order to structure your application. They include: 

- `.#{$prefix}--css-grid` - defines the overall grid context and sets some useful attributes like width and margin
- `.#{$prefix}--col-span-*` - used to define individual columns 

Additional class types are available for advanced usages such as subgrids, offset, alignment utilities, and breakpoint helpers to configure the grid at different viewport widths. For further information on these and others, see the [`@carbon/grid`](https://github.com/carbon-design-system/carbon/tree/main/packages/grid) package.

As an example, here's how a 4 column grid could be configured with the default prefix:

```html
<div class="cds--css-grid">
    <div class="cds--col-span-4"></div>
    <div class="cds--col-span-4"></div>
    <div class="cds--col-span-4"></div>
    <div class="cds--col-span-4"></div>
</div>
```


### Grid Mixins

In the event that you'd like to configure your own classes for portions of the grid, there are a few mixins that can be used. 
- `css-grid()` provides the base grid definition
- `subgrid()` provides the subgrid definition
- `carbon--aspect-ratio($aspect-ratios: $carbon--aspect-ratios)` generates the CSS classname utilities for the aspect ratios

```scss
.custom-grid-class {
  @include css-grid();
}
```


## Motion

| Import                               | Filepath            |
| :----------------------------------- | :------------------ |
| `@use '@carbon/styles/scss/motion';` | `scss/_motion.scss` |

## Reset

| Import                              | Filepath           |
| :---------------------------------- | :----------------- |
| `@use '@carbon/styles/scss/reset';` | `scss/_reset.scss` |

## Spacing

| Import                                | Filepath             |
| :------------------------------------ | :------------------- |
| `@use '@carbon/styles/scss/spacing';` | `scss/_spacing.scss` |

## Theming

| Import                               | Filepath            |
| :----------------------------------- | :------------------ |
| `@use '@carbon/styles/scss/theme';`  | `scss/_theme.scss`  |
| `@use '@carbon/styles/scss/themes';` | `scss/_themes.scss` |

## Type

| Import                             | Filepath          |
| :--------------------------------- | :---------------- |
| `@use '@carbon/styles/scss/type';` | `scss/_type.scss` |

## Components

**Files**

| Component | Import                                             | File                                                        |
| :-------- | :------------------------------------------------- | :---------------------------------------------------------- |
| Accordion | `@use '@carbon/styles/scss/components/accordion';` | [`scss/components/accordion`](../scss/components/accordion) |

## Utilities

**Files**

| Import                                                | Description |
| :---------------------------------------------------- | :---------- |
| `@use '@carbon/styles/scss/utilities/focus-outline';` |             |

## Configuration

You will need to configure Sass to be able to lookup packages from your
`node_modules` folder. To do this, use the `includePaths` option and set its
value to an array of locations where Sass should look to find `node_modules`
folders.

For most teams, this configuration will look like:

```json
{
  "includePaths": ["node_modules"]
}
```

For bundler specific solutions, check out the sections below for your bundler of
choice. If you can't find what you're looking for, please make an
[issue](https://github.com/carbon-design-system/carbon/issues/new/choose) and
we'll try to get instructions for it added!

### `sass-loader`

[Link](https://www.npmjs.com/package/sass-loader)

Update your `webpack.config.js` that uses `sass-loader` with the following
options passed into `sassOptions`:

```js
{
  loader: 'sass-loader',
  options: {
    sassOptions: {
      includePaths: ['node_modules'],
    },
  },
}
```

### Parcel

[Link](https://www.npmjs.com/package/parcel)

Create a `.sassrc` file with the following configuration:

```json
{
  "includePaths": ["node_modules"]
}
```

### Vite

[Link](https://vitejs.dev/)

Create a `vite.config.js` file with the following configuration:

```js
export default {
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules'],
      },
    },
  },
};
```
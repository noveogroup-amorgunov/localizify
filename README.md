# Localizify

![Like action](https://img.shields.io/github/actions/workflow/status/noveogroup-amorgunov/amorgunov.com/likes.yml?branch=master&style=flat&colorA=000000&colorB=000000)  [![Downloads per month](https://img.shields.io/npm/dm/localizify?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/localizify) [![Downloads per month](https://img.shields.io/npm/v/localizify?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/localizify)

> Version 3.x.x has BREAK CHANGES (some additional API was changed). See more in [release notes]().

*Localizify* is **fully typed**, **zero-dependencies** and **performant library** for translation and localization in *NodeJS* or *browser*.

It's a solution which **you want to use** if you like clear API and TypeScript suggestions.

## Features

- Fully (*almost*) TypeScript typed and infering
- Zero dependencies (**only 2KB** gziped)
- Translation and localization
- Interpolation of values to translations
- Detection user language in browser and in server requests
- Events system (fire event if locale was changed or translation is not found)
- Easy nested-object translations

## Examples

See base example in CodeSandbox: [Open in CodeSandbox](TODO) (with JSON keysets: [Open in CodeSandbox](https://codesandbox.io/s/localizify-37rpe))

- Base usage: [examples/base](./examples/react)
- Usage with React: [examples/react](./examples/react)
- Usage with Express: [examples/express](./examples/express)
- Usage with HapiJS: [examples/hapijs](./examples/hapijs)

## Installation

You can install library from npm (yarn, pnpm):

```bash
npm i localizify
```

or download file (full version or minify bundle) from `dist` folder and add the script to the page (*only for browsers*):

```html
<script src="/path/to/localizify.min.js"></script>
```

## Usage (quick start guide)

Localizify has two general cases how you can work with library:

- Recommended: Create new instnce by constructor. It open full TypeScript opportunities and provide you max type safe approach.

- Use singelton instance of `Localizify`, which exporting with `t` alias. You can add translations in one module and use it in another. But in this mode it's no way infer TypeScript types and you should check the correctness of translations youself. This approach exists only for backward compatibility

First of all you need add locales with translations and set locale by default:

```ts
// src/shared/t.ts

import { Localizify } from 'localizify'

export const keysets = {
    en: {
        hello: 'Hello, bro! How are you?',
        say: { awesome: 'You are awesome, {name}' },
    },
    ru: {
        hello: 'Привет, бро! Как сам?',
        say: { awesome: 'Ты прекрасен, {name}' },
    },
} as const
// 👆 Use `as const` assertion to library can infer types for interpolations
```

```ts
// Add translations (keysets) in constructor
const localizify = new Localizify(keysets)

// Or add by chaining
const localizify = new Localizify({})
    .add('en', keyset.en)
    .add('ru', keyset.ru)
    .setLocale('en') // en locale in using by default

const { t } = localizify

export { localizify, t }
```

That's all. You can use `t` in your code:

```ts
// src/any-module.ts
import { t, localizify } from 'src/shared/t'

t('hello'); // Hello, bro! How are you?
t('say.awesome', { name: 'uncle Ben' }); // You are awesome, {name}

localizify.setLocale('ru')
// 👆 You can set only known locale

// if we haven't translition, TypeScript say about it,
// but if you run code anyway, function return key
// @ts-expect-error
t('say.unknown'); // say.unknown
// ^^^^^^^^^^^^

t('hello'); // Привет, бро! Как сам?
t('say.awesome', { name: 'дядушка Бэн' }); // Ты прекрасен, дядушка Бэн
```

## Documentation

- [Events](./docs/feature-events.md)
- [Translation's interpolation](./docs/feature-interpolation.md)
- [Nested object](./docs/feature-nested-object.md)
- [Set locale](./docs/feature-set-locale.md)
- [Translate function](./docs/feature-translate.md)
- [Detect locale](./docs/feature-detect.md)

## Roadmap

- [ ] Add pluralization system
- [ ] Fix TypeScript errors in types (remove all any)
- [ ] Create monorepo with packages for frameworks (e.g. *React*)
- [ ] Comparations with other libraries
- [ ] Add examples

## Troubleshoots

- TypeScript infering types is not working if you store keysets in json files (see issue: https://github.com/microsoft/TypeScript/issues/32063)

## License

Licensed under the MIT license.

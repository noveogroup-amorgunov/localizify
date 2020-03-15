<div align="center">

[![localizify](/logo.png?raw=true "Localize your messages easily")](https://github.com/noveogroup-amorgunov/localizify)

[![Travis Build Status](https://flat.badgen.net/travis/noveogroup-amorgunov/localizify)](https://travis-ci.org/noveogroup-amorgunov/localizify) [![Downloads per month](https://flat.badgen.net/npm/dm/localizify)](https://www.npmjs.com/package/localizify) [![Version](https://flat.badgen.net/npm/v/localizify)](https://www.npmjs.com/package/localizify) [![License](https://flat.badgen.net/npm/license/localizify)](https://www.npmjs.com/package/localizify) ![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)

<br/>
<br/>
</div>

localizify is very **light and performant library for translation and localization** in `Node.js` and the browser.

## Goals and features

- ❗️ Written on TypeScript
- :rocket: No dependencies (only 2KB gziped)
- :dancers: Translation and localization
- :gift: Interpolation of values to translations
- :penguin: Detection user language in browser and in server requests
- :mega: Events when locale was changed or translation isn't found
- :moyai: Easy scope system (nested-object translations)
- :slot_machine: A lot of examples

## Examples

- react: you can use [react-localizify](https://github.com/noveogroup-amorgunov/react-localizify), which provide high order component and hook, or write it yourself by example ([see it in ./docs/usage-with-react](./docs/usage-with-react.md))
- [./docs/usage-with-express](./docs/usage-with-express.md)
- [./docs/usage-with-hapijs](./docs/usage-with-hapijs.md)

## Installation

You can install library from npm:

```shell
npm install localizify --save
# or using yarn
yarn add localizify
```

or download file (full version or minify bundle) from `dist` folder and add the script to the page (only for browsers):

```html
<script src="/path/to/localizify.min.js"></script>
```

## Usage

[Open in CodeSandbox](https://codesandbox.io/s/localizify-37rpe).

### Quick start

[localizify](https://github.com/noveogroup-amorgunov/localizify) returns instance of `Localizify`, so it's singelton. You can add translations in one module and use it in another (but you can get `Localizify` from `localizify.Instance`).

First of all you need add locales with translations and set locale by default:

```javascript
const localizify = require('localizify');

const en = require('../messages/en.json');
const fr = require('../messages/fr.json');

localizify
  .add('en', en)
  .add('fr', fr)
  .setLocale('en');
  
```
```json
# en.json
{
  "hello world": "Hello world!",
  "how are you, {name}?": "How are you, {name}?"
}
```
```json
# fr.json
{
  "hello world": "Bonjour tout le monde!",
  "how are you, {name}?": "Сomment êtes-vous, {name}?"
}
```

You can't set unknown locale (without translations):

```javascript
const localizify = require('localizify');

localizify.setLocale('es');
localizify.getLocale(); // en, because 'es' is unknown locale
  
  
// to check that it's available locale
localizify.isLocale('es'); // false
localizify.isLocale('en'); // true
```

Now for get translation by key you can use `localizify.translate(key)` or `localizify.t(key)` methods:

```javascript
const { t } = require('localizify');

t('hello world'); // Hello world!
t('hello, {username}', { username: 'Alexander Morgunov' }); // hello, Alexander Morgunov
t('how are you, {name}', { name: 'Sasha' }); // How are you, Sasha?

localizify.setLocale('fr');

// if we haven't translition, return default message
t('hello, {username}', { username: 'Alexander Morgunov' });  // hello, Alexander Morgunov

// if have
t('hello world'); // Bonjour tout le monde!
t('how are you, {name}?', { name: 'Sasha' }); // Сomment êtes-vous, Sasha?
```

If locale don't contain appropriate translation, return source interpolated key (key may be equal message) and emit event.

### Addition features

#### Translation as nested object

Translation data is organized as a nested object using the top-level key as namespace (scope or context):

```json
{
  "bot" : {
    "startagain": "reset system",
    "turn_off": "Bot was turned off by {name}.",
    "turn_on": "Bot was turn on!",
    "statuses": {
      "active": "Active",
      "remote": "Remote"
    }
  },
  "web": {
    "go_to_messenger": "Go to messenger",
    "sign_up": "Registration"
  }
}
```

The key argument can be a dot-separated key. See examples below:

```javascript
t('bot.turn_off', { name: 'Alex' }); // Bot was turned off by Alex.
t('bot.statuses.active'); // Active

t('web.sign_up'); // Registration
```

The `scope` (namespace) option can be either a single key or a dot-separated key. You can combinate keys and scopes as you wish:

```javascript
t('turn_off', { name: 'Alex', scope: 'bot' }); // Bot was turned off by Alex.

t('statuses.active', { scope: 'bot' }); // Active
t('active', { scope: 'bot.statuses' }); // Active
```

#### Available events

When translation is missing, *localizify* emit an event about it. You can listen it:

```javascript
localizify.onTranslationNotFound((locale, key, scope) => {});
```

The `setLocale` method emits an event you can listen to:

```javascript
localizify.onLocaleChange((locale, previous) => {});
```

#### Register default scope and interpolations

You can set scope for your module by default:

```javascript
localizify.setDefaultScope('web');

t('go_to_messenger'); // Go to messenger
t('sign_up'); // Registration

localizify.clearDefaultScope(); // clear default scope
```
You can add translations for certain scope:

```javascript
localizify.add('en', 'bot', { 'hello': "hello, bot" });
```

---

You can register default interpolations using the `registerInterpolations` method. Interpolations you give as options to the translate method take precedence over registered interpolations.

```javascript
localizify.add('en', {
  my_awesome_namespace: {
    greeting: 'Hello {name} in {app_name}!'
  }
});

localizify.registerInterpolations({ app_name: 'My Awesome App' });

t('my_awesome_namespace.greeting', { name: 'Alex' }); // Hello Alex in My Awesome App!
t('my_awesome_namespace.greeting', { name: 'Alex', app_name: 'The Bar App' }); // Hello Alex in The Bar App!
```

## API

See library API in [index.d.ts](./index.d.ts).

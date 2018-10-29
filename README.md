<h1 align="center">
  localizify
  <br>
</h1>

<h4 align="center">Localize your messages easily</h4>

<p align="center">
  <a href="https://travis-ci.org/noveogroup-amorgunov/localizify">
    <img src="https://img.shields.io/travis/noveogroup-amorgunov/localizify/master.svg?style=flat-square"
         alt="Travis Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/dm/localizify.svg?style=flat-square"
         alt="Downloads per month" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/v/localizify.svg?style=flat-square"
         alt="Version" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/l/localizify.svg?style=flat-square"
         alt="License" />
  </a>
   <a href="https://github.com/airbnb/javascript">
    <img src="https://camo.githubusercontent.com/1c5c800fbdabc79cfaca8c90dd47022a5b5c7486/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d616972626e622d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265"
         alt="Standart" />
  </a> 
  
</p>

Very light library for translation and localization in `Node.js` and the browser :cn: :us: :fr: :es:	:it: :ru: :uk: :de: :performing_arts:


#### Features

- :rocket: No dependencies (only 2KB gziped)
- :dancers: Translation and localization
- :gift: Interpolation of values to translations
- :penguin: Detect user language in browser and in server requests
- :mega: Events when locale was changed and translation isn't found
- :moyai: Easy scope system (nested-object translations)
- :slot_machine: A lot of examples

#### Examples

- [react-hoc](examples/react-hoc)
- [react-simple](#usage-with-react)
- [express](#usage-with-express)
- [hapijs](#usage-with-hapijs)


## Installation

You can install library from npm:

```shell
npm install localizify --save
# or using yarn
yarn add localizify
```

or download file (full version or minify bundle) from `dist` folder and add the script to the page (only for browsers):

```html
<script src="/path/to/localizy.min.js"></script>
```

## Usage

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
localizify.getLocale('en'); // en, because 'es' is unknown locale
  
  
// to check that it's available locale
localizify.isLocate('es'); // false
localizify.isLocate('en'); // true
```

Now for get translition by key you can use `localizify.translate(key)` or `localizify.t(key)` methods:

```javascript
const { t } = require('localizify');

t('hello world'); // Hello world!
t('hello, {username}', { username: 'Alexander Morgunov' }); // hello, Alexander Morgunov
t('how are you, {name}', { name: 'Sasha' }) // How are you, Sasha?

localizify.setLocale('fr');

// if we haven't translition, return default message
t('hello, {username}', { username: 'Alexander Morgunov' });  // hello, Alexander Morgunov

// if have
t('hello world'); // Bonjour tout le monde!
t('how are you, {name}', { name: 'Sasha' }) // Сomment êtes-vous, Sasha?
```

If locale don't contain appropriate translition, return source interpolated key (key may be equal message) and emit event.

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
};

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

#### `new localizify.Instance() => localizify`

But default returns instance of Localizify, so it's singelton. You can add translations in one module and use it in another. But you can create another Localizify instance.

#### `localizify.getLocale()`

Get selected locale.

#### `localizify.setLocale(string locale) => this`

Change or set locale. If locales list includes passed locale and it's not set now, set locale or emit event `CHANGE_LOCALE`. Return `this` for chaining.

#### `localizify.isLocale(string locale) => boolean`

Check that locale is registered

#### `localizify.onLocaleChange(function callback) => function`

Add handler which will be exucated when locale change.

#### `localizify.onTranslationNotFound(function callback) => function`

Add handler which will be exucated when translation is not found.

#### `localizify.setDefaultScope(string scope) => this`

#### `localizify.clearDefaultScope() => this`

#### `localizify.registerInterpolations(object data) => this`

Register default interpolations. Interpolations you give as options to the translate method take precedence over registered interpolations.

#### `localizify.add(string locale, scopeOrTranslitions, ?string _translations) => this`

Register new locale. If scope is provided, translations will be third argument, otherwise - second.

#### `localizify.detectLocale(?string language) => string|false`

Define user's language by browser or by request header language. `language` params should be passed from server headers (`request.headers['accept-language']`). In client-size this param is optional (usually not using at all).

#### `localizify.translate(string key, ?object data) => string`

Translate by key! If translation not found, return passed string with replacing data to string and emit `TRANSLATION_NOT_FOUND` event.

## Examples

### Usage with express:
[localizify](https://github.com/noveogroup-amorgunov/localizify) can work together with [express](http://expressjs.com/). First of all add middleware to switch locale on request:

```javascript
const localizify = require('localizify');

app.configure(() => {
    // ...
    app.use((request, response, next) => {
        const lang = localizify.detectLocale(request.headers['accept-language']) || "en";
        localize.setLocale(lang);
        next();
    });
    // ...
});
```
And export translate function as static helpers

```javascript
app.helpers({
    // ...
    translate: localizify.translate,
});
```

### Usage with hapi.js:
[localizify](https://github.com/noveogroup-amorgunov/localizify) can work together with [hapi.js](https://hapijs.com/) too.

Create new plugin which add middleware to set locale on current request

```javascript
const localizify = require('localizify');

exports.register = (server, options, next) => {
  server.ext('onRequest', (request, reply) => {
    const language = localizify.detectLocale(request.headers['accept-language']) || 'en';
    localizify.setLocale(language);

    return reply.continue();
  });

  next();
};
```
Register plugin:

```javascript
server.register(PLUGIN_NAME);
```

### Usage with React:

You can see example in [spring-mvc-react](https://github.com/noveogroup-amorgunov/spring-mvc-react) example repository.

First, create a language switcher component:

```javascript
import React from 'react';
import localizify, { t } from 'localizify';

const LanguageSwitcher = React.createClass({
  getClass(locale) {
    return localizify.getLocale() === locale ? 'active' : '';
  },

  onChangeLocale(event) {
    const element = event.target;
    if (element.className !== 'active') {
      const locale = element.textContent.toLowerCase();
      localStorage.locale = locale;
      location.reload(); // reload page
    }
  },

  render() {
    return (
      <div>
        <span onClick={this.onChangeLocale} className={this.getClass('en')}>EN</span>
        <span onClick={this.onChangeLocale} className={this.getClass('fr')}>FR</span>
      </div>
      
    );
  }
});

export default LanguageSwitcher;
```

Set locale in init appication file:

```javascript
import localizify from 'localizify';

// load messages (e.g. usign webpack and json-loader)
import en from './messages/en.json';
import fr from './messages/fr.json';

const locale = localStorage.locale || localizify.detectLocale() || 'en';

localizify
  .add('en', en)
  .add('fr', fr)
  .setLocale(locale);

```

And using in any component:

```javascript
import { t } from 'localizify';
import React from 'react';

import LanguageSwitcher from './language-switcher';

var Component = React.createClass({
  render() {
    return (
      <div>
        {t('hello world')}
        <LanguageSwitcher />
      </div>
    );
  }
});

export default Component;
```

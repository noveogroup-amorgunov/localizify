<h1 align="center">
  localizify
  <br>
</h1>

<h4 align="center">Easy localization for your messages</h4>

<p align="center">
  <a href="https://travis-ci.org/noveogroup-amorgunov/localizify">
    <img src="https://travis-ci.org/noveogroup-amorgunov/localizify.svg?branch=master"
         alt="Travis Build Status" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/dm/localizify.svg"
         alt="Downloads per month" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/v/localizify.svg"
         alt="Version" />
  </a>
  <a href="https://www.npmjs.com/package/localizify">
    <img src="https://img.shields.io/npm/l/localizify.svg"
         alt="License" />
  </a>
</p>

Very light library for translation and localization in `Node.js` and the browser.

**Features:**

- Translation and localization
- Interpolation of values to translations
- Detect user language in browser and in server requests

## Installation

You can install library from npm:

```shell
npm install localizify --save
```

## Usage

[localizify](https://github.com/noveogroup-amorgunov/localizify) returns instance of Localizify, so it's singelton. You can add translations in one module and use it in other. 

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

You can't set unknown locale (without adding translations):

```javascript
const localizify = require('localizify');

localizify.setLocale('es');
localizify.getLocale('en'); // en, because 'es' is unknown locale
  
  
// to check that it's available locale
localizify.isLocate('es'); // false
```

Now for get translition you can use `localizify.translate(msg)` or `t(msg)` methods:

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

If locale don't contain translition, return translition with default locale (you can set it using `setDefaultLocale(locale)` method). If default locale don't contain translition too, return source message.



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
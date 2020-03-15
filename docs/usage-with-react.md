# Usage with React

## Deprecated (for react v15)

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

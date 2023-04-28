You can't set unknown locale (without translations):

```javascript
const localizify = require('localizify');

localizify.setLocale('es');
localizify.getLocale(); // en, because 'es' is unknown locale

// to check that it's available locale
localizify.isLocale('es'); // false
localizify.isLocale('en'); // true
```

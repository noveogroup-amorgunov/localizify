# Usage with express
[localizify](https://github.com/noveogroup-amorgunov/localizify) can work together with [express](http://expressjs.com/).

First of all add middleware to switch locale on request:

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

And export translate function as static helpers:

```javascript
app.helpers({
    // ...
    t: localizify.translate,
});
```

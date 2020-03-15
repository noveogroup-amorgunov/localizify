# Usage with hapi.js

[localizify](https://github.com/noveogroup-amorgunov/localizify) can work together with [hapi.js](https://hapijs.com/).

Create new plugin which add middleware to set locale on current request:

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

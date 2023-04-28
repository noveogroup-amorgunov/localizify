#### Available events

When translation is missing, _localizify_ emit an event about it. You can listen it:

```javascript
localizify.onTranslationNotFound((locale, key, scope) => {});
```

The `setLocale` method emits an event you can listen to:

```javascript
localizify.onLocaleChange((locale, previous) => {});
```
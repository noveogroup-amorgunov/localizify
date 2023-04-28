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
localizify.add('en', 'bot', { hello: 'hello, bot' });
```

---

You can register default interpolations using the `registerInterpolations` method. Interpolations you give as options to the translate method take precedence over registered interpolations.

```javascript
localizify.add('en', {
    my_awesome_namespace: {
        greeting: 'Hello {name} in {app_name}!',
    },
});

localizify.registerInterpolations({ app_name: 'My Awesome App' });

t('my_awesome_namespace.greeting', { name: 'Alex' }); // Hello Alex in My Awesome App!
t('my_awesome_namespace.greeting', { name: 'Alex', app_name: 'The Bar App' }); // Hello Alex in The Bar App!
```

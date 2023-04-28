#### Translation as nested object

Translation data is organized as a nested object using the top-level key as namespace (scope or context):

```json
{
    "bot": {
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
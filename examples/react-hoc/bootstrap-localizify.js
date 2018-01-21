import localizify from 'localizify';

const en = {
    "hello world": "Hello world!",
    "how are you, {name}?": "How are you, {name}?"
};

const fr = {
    "hello world": "Bonjour tout le monde!",
    "how are you, {name}?": "Сomment êtes-vous, {name}?"
};

const ru = {
    "hello world": "Привет мир",
    "how are you, {name}?": "Как твои дела, {name}?"
};


localizify
    .add('en', en)
    .add('fr', fr)
    .add('ru', ru)
    .setLocale('fr');

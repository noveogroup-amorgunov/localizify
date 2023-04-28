export const keysets = {
    en: {
        hello: 'Hello, bro! How are you?',
        say: {
            awesome: 'You are awesome, {name}',
            notBad: 'You are not bad',
        },
        debug: "It's app:{app}",
    },
    ru: {
        hello: 'Привет, бро! Как сам?',
        say: {
            awesome: 'Ты прекрасен, {name}',
            notBad: 'А ты неплох',
        },
        debug: 'Это приложуха:{app}',
    },
} as const;

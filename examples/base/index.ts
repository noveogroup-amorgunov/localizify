import { Localizify } from '../../src/localizify';
import { keysets } from './keysets';

const { translate: t } = new Localizify(keysets, { app: 'example/base' });

t('say.awesome', { name: 'uncle Ben' });

console.log(t('say.awesome', { name: 'uncle Ben' })); // You are awesome, Uncle Ben
console.log(t('debug')); // It's example/base

const { translate: t2 } = new Localizify({})
    .add('en', keysets.en)
    .add('ru', keysets.ru)
    .setLocale('ru')
    .registerInterpolations({ app: 'example/base' });

console.log(t2('say.awesome', { name: 'дядя Бэн' })); // Ты прекрасен, дядя Бэн
console.log(t2('debug')); // Это приложуха:example/base

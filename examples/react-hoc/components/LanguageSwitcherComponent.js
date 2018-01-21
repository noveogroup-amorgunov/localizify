import {LocalizifyConnector} from '../localizify';
import React from 'react';

const LanguageSwitcherComponent = props => {
    const { localizer } = props;

    const languagesList = localizer.getStore().localesList;
    const currentLocale = localizer.getLocale();

    const getClass = locale => currentLocale === locale ? 'active' : '';

    const onChangeLocale = (event) => {
        const el = event.target;
        if (!el.classList.contains('active')) {
            const locale = el.dataset.locale;
            localizer.setLocale(locale);
        }
    }

    return (
        <div className="language-switcher">
            {languagesList.map(locale => (
                <span
                    key={locale}
                    data-locale={locale}
                    onClick={onChangeLocale}
                    className={getClass(locale)}>
                    {locale.toUpperCase()}
                </span>
            ))}
        </div>
    );
};

export default LocalizifyConnector(LanguageSwitcherComponent);

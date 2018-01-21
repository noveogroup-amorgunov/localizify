import {LocalizifyConnector} from '../localizify';
import React from 'react';

const AwesomeComponent = props => {
    const { t } = props;

    const translationKeys = [
        { key: 'hello world' },
        { key: 'how are you, {name: "Sasha"}?', data: { name: 'Sasha' } },
        { key: 'unknown key' },
    ];

    return (
        <ul className="translation-list">
            {translationKeys.map((tr, index) => (
                <li key={index}>
                    <span>t('{tr.key}')</span> => <strong>{t(tr.key, tr.data)}</strong>
                </li>
            ))}
        </ul>
    );
};

export default LocalizifyConnector(AwesomeComponent);

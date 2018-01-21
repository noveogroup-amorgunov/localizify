import React from 'react';
import ReactDOM from 'react-dom';
import AwesomeComponent from './components/AwesomeComponent';
import LanguageSwitcherComponent from './components/LanguageSwitcherComponent';
import LocalizifyProvider from './localizify/LocalizifyProvider';

import './bootstrap-localizify';
import './index.css';


const App = LocalizifyProvider(() => (
    <div className="App">
        <h1>Localizify React HOC Example</h1>
        <AwesomeComponent />
        <LanguageSwitcherComponent />
    </div>
));

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}

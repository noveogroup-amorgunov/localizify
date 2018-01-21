import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localizify from 'localizify';

export default (ComposedComponent, localizer = localizify) => {
    class LocalizifyProvider extends Component {
        constructor() {
            super();

            this.state = {
                currernLocale: localizer.getLocale()
            };

            this.originalSetLocale = localizer.setLocale.bind(localizer);
            localizer.setLocale = (locale) => {
                if (localizer.isLocale(locale)) {
                    this.originalSetLocale(locale);
                    this.setState({ currernLocale: locale });
                }
            };
        }

        getChildContext() {
            return {
                t: localizer.t.bind(localizer),
                localizer: localizer
            };
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    }

    LocalizifyProvider.displayName = `LocalizifyProvider${ComposedComponent.displayName || ComposedComponent.name || 'Component'}`;
    LocalizifyProvider.childContextTypes = {
        t: PropTypes.func,
        localizer: PropTypes.object,
    };

    return LocalizifyProvider;
};

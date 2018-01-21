import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localizify from 'localizify';

export default (ComposedComponent, localizer = localizify) => {
    class LocalizationWrapper extends Component {
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

    LocalizationWrapper.displayName = `Wrapped${ComposedComponent.displayName || ComposedComponent.name || 'Component'}`;
    LocalizationWrapper.childContextTypes = {
        t: PropTypes.func,
        localizer: PropTypes.object,
    };

    return LocalizationWrapper;
};

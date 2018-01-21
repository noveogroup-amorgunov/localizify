/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

export default (ComposedComponent) => {
    const LocalizeConnected = (props, context) => {
        const { t, localizer } = context;

        if (typeof t !== 'function') {
            console.warn(`Attempted to connect ${ComposedComponent.displayName} to localizify, but no valid
          instance was found on context. Did you render this in a <LocalizifyProvider/> context?`);
        }
        return (<ComposedComponent {...props} t={t} localizer={localizer} />);
    };

    LocalizeConnected.displayName = `LocalizeConnected(${ComposedComponent.name})`;
    LocalizeConnected.contextTypes = {
        t: PropTypes.func,
        localizer: PropTypes.object,
    };

    return LocalizeConnected;
};

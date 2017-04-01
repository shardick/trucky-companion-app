import React, {Component, PropTypes} from 'react';
import {AppState, Linking} from 'react-native';
import RM from '../routes';
import AS from '../AppSettings';
import LC from '../Locales/LocaleManager';
import SM from '../Styles/StyleManager';

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

class BaseTruckyComponent extends Component
{
    constructor()
    {
        super();

        this.RouteManager = new RM();
        this.AppSettings = AS;
        this.LocaleManager = new LC();
        this.StyleManager = new SM();
    }

    componentWillMount()
    {
        this
            .RouteManager
            .setNavigator(this.props.navigator);
    }

    componentDidMount()
    {
        this
            .RouteManager
            .setNavigator(this.props.navigator);
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));

        this
            .fetchData()
            .done();
    }

    async fetchData()
    {
        // override with fetchData screen specific
    }

    _handleAppStateChange(nextAppState) {
        if (nextAppState === 'active') {
            this
                .fetchData()
                .done();
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
    }

    navigateUrl(url)
    {
        Linking
            .canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log('Don\'t know how to open URI: ' + url);
                }
            });
    }
}

BaseTruckyComponent.propTypes = propTypes;

module.exports = BaseTruckyComponent;
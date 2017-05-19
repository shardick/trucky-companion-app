import React, {Component, PropTypes} from 'react';
import {AppState, Linking, Platform, BackAndroid} from 'react-native';
import RM from '../routes';
import AS from '../AppSettings';
import LC from '../Locales/LocaleManager';
import SM from '../Styles/StyleManager';

/**
 * Base Component class for all Screens
 *
 * @class BaseTruckyComponent
 * @extends {Component}
 */
class BaseTruckyComponent extends Component
{
    constructor()
    {
        super();

        // setting up common objects
        this.RouteManager = new RM();
        this.AppSettings = AS;
        this.LocaleManager = new LC();
        this.StyleManager = new SM();
    }

    componentWillMount()
    {
        var instance = this;

        // Support to Android Back button operations
        if (Platform.OS == 'android') {
            BackAndroid.addEventListener('hardwareBackPress', () => {
                if (instance.RouteManager.navigator && instance.RouteManager.navigator.getCurrentRoutes().length > 1) {
                    instance.RouteManager.pop();
                    return true;
                }
                return false;
            });
        }

        // sets the navigator to RouteManager
        this
            .RouteManager
            .setNavigator(this.props.navigator);
    }

    componentDidMount()
    {
        // event listener for App State change, when application wake up, fetch new data

        AppState.addEventListener('change', this._handleAppStateChange.bind(this));

        // auto load data for all Screen when needeed, children classes overrides
        // fetchData
        this
            .fetchData()
            .done();
    }

    /**
     * Generic (and empty) fetch data method. Children classes overrides it
     *
     *
     * @memberOf BaseTruckyComponent
     */
    async fetchData()
    {
        // override with fetchData screen specific
    }

    /**
     * Handle the AppState change
     *
     * @param {any} nextAppState
     *
     * @memberOf BaseTruckyComponent
     */
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

    /**
     * Helper method to open Internet URL with the browser
     *
     * @param {any} url
     *
     * @memberOf BaseTruckyComponent
     */
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

    onPop()
    {
        //console.warn('pop');
    }

    getCurrentRoute()
    {
        var routes = this.RouteManager.navigator.getCurrentRoutes();
        return routes[routes.length-1];
    }
}

module.exports = BaseTruckyComponent;
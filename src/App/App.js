import React, {Component} from 'react';
import {
    Navigator,
    NativeModules,
    StatusBar,
    View,
    BackAndroid,
    Platform
} from 'react-native';
import {ThemeProvider, Icon} from 'react-native-material-ui';
import Container from '../Container';
import OneSignal from 'react-native-onesignal';
import SM from '../Styles/StyleManager';
import RM from '../routes';
var DeviceInfo = require('react-native-device-info');
import AppDrawerLayout from '../Components/AppDrawerLayout';

const UIManager = NativeModules.UIManager;

/**
 * Main App Component. Contains routing logic, theming and main scene rendering inside navigator
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {

    constructor()
    {
        super();
        this.StyleManager = new SM();
        this.RouteManager = new RM();
        //this.NotificationManager = new NotificationManager();
    }

    /**
     * Static method for managing scene rendering
     *
     * @static
     * @param {any} route
     * @returns
     *
     * @memberOf App
     */
    static configureScene(route) {
        return route.animationType || Navigator.SceneConfigs.FadeAndroid;
    }

    /**
     * Static method for scene rendering. Accepts route and navigato as parameters. Route is an object from RouteManager.routes, navigator is a React Navigator
     *
     * @static
     * @param {any} route
     * @param {any} navigator
     * @returns
     *
     * @memberOf App
     */
    static renderScene(route, navigator) {
        return (
            <Container>
                {DeviceInfo.isTablet() && route.title == 'SplashScreen' && App.renderRoute(route, navigator)}
                {DeviceInfo.isTablet() && route.title != 'SplashScreen' && App.renderTabletView(route, navigator)}
                {!DeviceInfo.isTablet() && App.renderRoute(route, navigator)}
            </Container>
        );
    }

    static renderTabletView(route, navigator)
    {
        return (
            <View style={AppStyles.tabletContainer}>
                <View style={AppStyles.drawerContainer}>
                    <AppDrawerLayout
                        page={route.reference}
                        ref={(appdrawer) => this.appdrawer = appdrawer}
                        navigator={navigator}/>
                </View>
                <View style={AppStyles.tabletRouteContainer}>
                    {App.renderRoute(route, navigator)}
                </View>
            </View>
        );
    }

    static renderRoute(route, navigator)
    {
        return (
            <View style={AppStyles.simpleFlex}>
                <route.Page
                    ref={(page => route.reference = page)}
                    route={route}
                    navigator={navigator}
                    data={route.data}
                    callback={route.callback}/>
            </View>
        );
    }

    componentWillMount() {

        // logic to enable animation experiments in React
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        // OneSignal notifications event listeners
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {

        // remove event listeners on unmouting
        OneSignal.removeEventListener('received', this.onReceived);
        OneSignal.removeEventListener('opened', this.onOpened);
        OneSignal.removeEventListener('registered', this.onRegistered);
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {}

    onOpened(openResult) {}

    onRegistered(notifData) {}

    onIds(device) {}

    /** 
     * * Main App Navigator
     * 
     *   
     * @returns 
     *
     * 
     * @memberOf App 
     * */

    renderNavigator()
    {
        return (<Navigator
            configureScene={App.configureScene}
            initialRoute={this.RouteManager.routes.splashScreen}
            ref={this.onNavigatorRef}
            renderScene={App.renderScene}/>);
    }

    render() {
        return (
            <ThemeProvider uiTheme={this.StyleManager.styles.uiTheme}>
                {this.renderNavigator()}
            </ThemeProvider>
        );
    }
}

var AppStyles = {
    simpleFlex: {
        flex: 1
    },
    tabletContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    drawerContainer: {
        width: 250,
        flex: 1
    },
    tabletRouteContainer: {
        flex: 3
    }
};
export default App;

import React, {Component} from 'react';
import {
    Navigator,
    NativeModules,
    StatusBar,
    View,
    BackAndroid,
    Platform
} from 'react-native';
import {ThemeProvider} from 'react-native-material-ui';
import Container from '../Container';
import OneSignal from 'react-native-onesignal';
import SM from '../Styles/StyleManager';
import RM from '../routes';
import NotificationManager from  '../Utils/NotificationManager';

const UIManager = NativeModules.UIManager;

// React Navigator instance to manage navigation 
var _navigator;

// Support to Android Back button operations
if (Platform.OS == 'android') {
    BackAndroid.addEventListener('hardwareBackPress', () => {
        if (_navigator && _navigator.getCurrentRoutes().length > 1) {
            _navigator.pop();
            return true;
        }
        return false;
    });
}


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
        _navigator = navigator;

        return (
            <Container>
                <route.Page route={route} navigator={navigator}/>
            </Container>
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

    onReceived(notification) {
        /*console.warn("Notification received: ", notification);*/
    }

    onOpened(openResult) {
     /* console.warn('Message: ', openResult.notification.payload.body);
      console.warn('Data: ', openResult.notification.payload.additionalData);
      console.warn('isActive: ', openResult.notification.isAppInFocus);
      console.warn('openResult: ', openResult);*/
    }

    onRegistered(notifData) {
        /*console.warn("Device had been registered for push notifications!", notifData)*/;
    }

    onIds(device) {
		/*console.warn('Device info: ', device);*/
    }



    /**
     * Main App Navigator
     * 
     * @returns 
     * 
     * @memberOf App
     */
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

export default App;

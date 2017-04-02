import React, {Component} from 'react';
import {
    Navigator,
    NativeModules,
    StatusBar,
    View,
    BackAndroid,
    Platform
} from 'react-native';

import styles from '../Styles';
import {ThemeProvider} from 'react-native-material-ui';
import RM from '../routes';
import Container from '../Container';
import OneSignal from 'react-native-onesignal';

const UIManager = NativeModules.UIManager;

var _navigator;

if (Platform.OS == 'android') {
    BackAndroid.addEventListener('hardwareBackPress', () => {
        if (_navigator && _navigator.getCurrentRoutes().length > 1) {
            _navigator.pop();
            return true;
        }
        return false;
    });
}

class App extends Component {

    constructor()
    {
        super();
        
        this.RouteManager = new RM();
    }

    static configureScene(route) {
        return route.animationType || Navigator.SceneConfigs.FadeAndroid;
    }
    static renderScene(route, navigator) {
        _navigator = navigator;

        return (
            <Container>
                <route.Page route={route} navigator={navigator}/>
                {/*<AppBottomNavigation navigator={navigator} active={route.navigationTab}/>*/}
            </Container>
        );
    }
    componentWillMount() {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
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
            <ThemeProvider uiTheme={styles.uiTheme}>
                {this.renderNavigator()}
            </ThemeProvider>
        );
    }
}

export default App;

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

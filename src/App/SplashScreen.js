import React, {Component} from 'react';
import {View, Image} from 'react-native';

import styles from '../Styles';
import {ThemeProvider} from 'react-native-material-ui';
import RouteManager from '../routes';
import Container from '../Container';

class SplashScreen extends Component {

    componentWillMount() {

        setTimeout(() => {
            this
                .props
                .navigator
                .push(RouteManager.routes.home);
        }, 2000);
    }

    render() {
        return (
            <Container>
                <View
                    style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: styles.uiTheme.palette.primaryColor
                }}>
                    <Image
                        source={require('../Assets/trucky_banner_white.png')}
                        style={{
                        width: 250,
                        height: 250
                    }}/>
                </View>
            </Container>
        );
    }
}

module.exports = SplashScreen;
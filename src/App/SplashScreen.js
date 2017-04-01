import React, {Component} from 'react';
import {View, Image} from 'react-native';

import {ThemeProvider} from 'react-native-material-ui';
import Container from '../Container';

import BaseTruckyComponent from '../Components/BaseTruckyComponent';

class SplashScreen extends BaseTruckyComponent {

    componentWillMount() {

        super.componentWillMount();

        setTimeout(() => {
            /*this
                .props
                .navigator
                .push(RouteManager.routes.home);*/

            this.RouteManager.push(this.RouteManager.routes.home);
            
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
                    backgroundColor: this.StyleManager.styles.uiTheme.palette.primaryColor
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

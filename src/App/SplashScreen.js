import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {ThemeProvider} from 'react-native-material-ui';
import Container from '../Container';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';

/**
 * 
 * 
 * @class SplashScreen
 * @extends {BaseTruckyComponent}
 */
class SplashScreen extends BaseTruckyComponent {

    componentWillMount() {

        super.componentWillMount();

        this.prepareFirstStart().then(() => {
            setTimeout(() => {
                /*this
                    .props
                    .navigator
                    .push(RouteManager.routes.home);*/

                this.RouteManager.push(this.RouteManager.routes.home);
                
            }, 2000);
        });
    }


    /**
     * Prepare app settings for first start.
     * Set default interface language according to device language. If not supported, defualt language is English
     * 
     * @memberOf SplashScreen
     */
    async prepareFirstStart()
    {
        var settings = await this.AppSettings.getSettings();

        if (settings.firstStart)
        {
            console.warn('Is First Start');

            if (this.LocaleManager.interfaceLanguageIsSupported())
            {
                console.warn('Interface language is supported: setting up');

                settings.language = this.LocaleManager.normalizeLanguage(this.LocaleManager.interfaceLanguage);
            }

            settings.firstStart = false;

            await this.AppSettings.saveSettings(settings);

            console.warn('First start = false updated');
        }
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

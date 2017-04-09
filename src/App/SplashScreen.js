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
        // load settings
        var settings = await this.AppSettings.getSettings();

        // handling fresh app start
        if (settings.firstStart)
        {
            console.warn('Is First Start');

            // checking if interface language is supported by LocaleManager
            if (this.LocaleManager.interfaceLanguageIsSupported())
            {
                console.warn('Interface language is supported: setting up');

                // interface language supported, setting up as default language for first start
                settings.language = this.LocaleManager.normalizeLanguage(this.LocaleManager.interfaceLanguage);
            }

            settings.firstStart = false;

            // updating settings
            await this.AppSettings.saveSettings(settings);

            console.warn('First start = false updated');
        }
    }

    render() {
        return (
            <Container>
                <View
                    style={this.StyleManager.styles.splashScreen}>
                    <Image
                        source={require('../Assets/trucky_banner_white.png')}
                        style={this.StyleManager.styles.splashScreenImage}/>
                </View>
            </Container>
        );
    }
}

module.exports = SplashScreen;

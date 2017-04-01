import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {Text, View, ScrollView, Image, Linking, TouchableHighlight, TouchableOpacity} = ReactNative;
import Container from '../Container';
import {Toolbar, Button} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';

/**
 * 
 * 
 * @class AboutScreen
 * @extends {BaseTruckyComponent}
 */
class AboutScreen extends BaseTruckyComponent
{

    /**
     * Creates an instance of AboutScreen.
     * 
     * @memberOf AboutScreen
     */
    constructor()
    {
        super();
    }

    /**
     * 
     * 
     * 
     * @memberOf AboutScreen
     */
    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.LocaleManager.strings.routeAboutTitle}/>);
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf AboutScreen
     */
    render() {
        return (
            <Container>
                {this.renderToolbar()}
                <View
                    style={this.StyleManager.styles.aboutCenter}>
                    <Image
                        source={require('../Assets/trucky_banner.png')}
                        style={this.StyleManager.styles.aboutImage}/>
                </View>
                <View style={this.StyleManager.styles.aboutCenter}>
                    <Text style={this.StyleManager.styles.aboutText}>Developed by Francesco 'ShArDiCk' Bramato</Text>
                    <Text style={this.StyleManager.styles.aboutText}>as a React Native playground</Text>                   
                </View>
                <View style={this.StyleManager.styles.aboutCenter} >
                     <Button primary raised text="View on GitHub" onPress={() => { this.navigateUrl('https://github.com/shardick/trucky-companion-app') }} />
                </View>
            </Container>
        )
    }
}

module.exports = AboutScreen;
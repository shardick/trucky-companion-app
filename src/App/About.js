import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {Text, View, ScrollView, Image, Linking, TouchableHighlight, TouchableOpacity} = ReactNative;
import Container from '../Container';
import {Toolbar, Button} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import BottomNavigation from '../Components/BottomNavigation';

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
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
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
                <ScrollView style={this.StyleManager.styles.bottomBarAdjustment}>
                    <View
                        style={this.StyleManager.styles.aboutCenter}>
                        <Image
                            source={require('../Assets/trucky_banner.png')}
                            style={this.StyleManager.styles.aboutImage}/>
                    </View>
                    <View style={this.StyleManager.styles.aboutCenter}>
                        <Text style={this.StyleManager.styles.aboutText}>Developed by Francesco 'ShArDiCk' Bramato</Text>
                        {/*Text style={this.StyleManager.styles.aboutText}>as a React Native playground</Text>*/}
                        <Text style={ { marginTop: 10, fontWeight: 'bold'}}>Become a Trucky supporter</Text>
                        <TouchableOpacity onPress={() => this.navigateUrl("https://www.patreon.com/shardick")}>
                            <Image source={require('../Assets/patreon_badge.png')} style={ { resizeMode: 'contain', width: 170, height: 60 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.navigateUrl("https://www.paypal.me/FrancescoBramato")}>
                            <Image source={require('../Assets/paypaldonate.png')} style={ { resizeMode: 'contain', width: 170, height: 60 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={this.StyleManager.styles.aboutCenter} >
                        <Button primary raised text="View on GitHub" onPress={() => { this.navigateUrl('https://github.com/shardick/trucky-companion-app') }} />
                    </View>
                    <View style={this.StyleManager.styles.aboutCenter} >
                        <Text style={{marginLeft: 10, marginLeft: 10}}>Credits: TruckersMP, SCS Software, World Of Trucks, Krashnz, Kat_pw, ETS2c.com, Truckers.events</Text>
                    </View>
                    </ScrollView>
                <BottomNavigation navigation={this.props.navigation} active="" />
            </Container>
        )
    }
}

module.exports = AboutScreen;
import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {Text, View, ScrollView, Image, Linking, TouchableHighlight, TouchableOpacity} = ReactNative;
import Container from '../Container';
import {Toolbar, Button} from 'react-native-material-ui';

import LocaleManager from '../Locales/LocaleManager';

var lc = new LocaleManager();

var styles = require('../Styles');
var AppSettings = require('../AppSettings');

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};


/**
 * 
 * 
 * @class AboutScreen
 * @extends {Component}
 */
class AboutScreen extends Component
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
            centerElement={lc.strings.routeAboutTitle}/>);
    }


    /**
     * 
     * 
     * 
     * @memberOf AboutScreen
     */
    viewOnGitHub = () => {
        Linking
            .canOpenURL('https://github.com/shardick/trucky-companion-app')
            .then(supported => {
                if (supported) {
                    Linking.openURL('https://github.com/shardick/trucky-companion-app');
                } else {
                    console.log('Don\'t know how to open URI: https://github.com/shardick/trucky-companion-app');
                }
            });
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
                    style={styles.aboutCenter}>
                    <Image
                        source={require('../Assets/trucky_banner.png')}
                        style={styles.aboutImage}/>
                </View>
                <View style={styles.aboutCenter}>
                    <Text style={styles.aboutText}>Developed by Francesco 'ShArDiCk' Bramato</Text>
                    <Text style={styles.aboutText}>as a React Native playground</Text>                   
                </View>
                <View style={styles.aboutCenter} >
                     <Button primary raised text="View on GitHub" onPress={this.viewOnGitHub} />
                </View>
            </Container>
        )
    }
}

module.exports = AboutScreen;
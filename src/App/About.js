import React, {Component} from 'react';
var ReactNative = require('react-native');
var {Text, View, ScrollView, Image, Linking, TouchableHighlight, TouchableOpacity} = ReactNative;
import Container from '../Container';

import {Toolbar, Button} from 'react-native-material-ui';

var styles = require('../Styles');
var AppSettings = require('../AppSettings');

class AboutScreen extends Component
{
    constructor()
    {
        super();
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.props.route.title}/>);
    }

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
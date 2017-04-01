import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    ScrollView,
} = ReactNative;
import Markdown from 'react-native-simple-markdown'
import Container from '../Container';
import {Toolbar} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import TruckersMPApi from '../Services/TruckersMPAPI';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';

class RulesScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        this.state = {
            api: new TruckersMPApi()
        };
    }

    async fetchData()
    {
        this.setState({loading: true});

        var rules = await this
            .state
            .api
            .rules();

        this.setState({rules: rules});

        this.setState({loading: false});
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.LocaleManager.strings.routeRulesTitle}/>);
    }

    render() {
        return (
            <Container>
                {this.renderToolbar()}
                {this.state.loading && <ActivityIndicator/>}
                {!this.state.loading && <ScrollView style={this.StyleManager.styles.rulesMarkDownContainer}>
                    <Markdown style={this.StyleManager.styles.rulesMarkDownSyles}>
                        {this.state.rules}
                    </Markdown>
                </ScrollView>
                }
            </Container>
        )
    }
}

module.exports = RulesScreen;
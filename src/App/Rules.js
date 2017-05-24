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
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';

class RulesScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        this.state = {
        };
    }

    async fetchData()
    {
        this.setState({loading: true});

        var api = new TruckyServices();
        var rules = await api.rules();

        this.setState({rules: rules});

        this.setState({loading: false});
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.pop()}
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
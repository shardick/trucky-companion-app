import React, {Component} from 'react';
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

var styles = require('../Styles');
var AppSettings = require('../AppSettings');
import TruckersMPApi from '../Services/TruckersMPAPI';

class RulesScreen extends Component
{
    constructor()
    {
        super();

        this.state = {
            api: new TruckersMPApi()
        };
    }

    componentDidMount()
    {
        this
            .fetchData()
            .done();
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
            centerElement={this.props.route.title}/>);
    }

    render() {
        return (
            <Container>
                {this.renderToolbar()}
                {this.state.loading && <ActivityIndicator/>}
                {!this.state.loading && <ScrollView style={styles.rulesMarkDownContainer}>
                    <Markdown style={styles.rulesMarkDownSyles}>
                        {this.state.rules}
                    </Markdown>
                </ScrollView>
                }
            </Container>
        )
    }
}

module.exports = RulesScreen;
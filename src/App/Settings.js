import React, {Component} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    Button,
    Alert,
    Switch,
    Picker,
    ScrollView
} = ReactNative;

import Container from '../Container';

import {
    Toolbar
} from 'react-native-material-ui';

var styles = require('../Styles');
var AppSettings = require('../AppSettings');

class SettingsScreen extends Component
{
    constructor()
    {
        super();

        this.state = {
            settings: {}
        }
    }

    componentDidMount()
    {
        this
            .loadSettings()
            .done();
    }

    async loadSettings()
    {
        var settings = await AppSettings.getSettings();

        this.setState({settings: settings});
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.props.route.title}/>);
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={{
                    marginTop: 10
                }}>
                    <View style={styles.appSettingsRow}>
                        <Text style={styles.appSettingsLabel}>Auto refresh game time</Text>
                        <View style={styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshGameTime, value)}
                                value={this.state.settings.autoRefreshGameTime}/>
                        </View>
                    </View>
                    <View style={styles.appSettingsRow}>
                        <Text style={styles.appSettingsLabel}>Auto refresh servers list</Text>
                        <View style={styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshServersList, value)}
                                value={this.state.settings.autoRefreshServersList}/>
                        </View>
                    </View>
                    <View style={styles.appSettingsRowColumns}>
                        <Text style={styles.appSettingsLabel}>Server list refresh interval</Text>
                        <View style={styles.appSettingsFieldBelow}>
                            <Picker
                                selectedValue={this.state.settings.serverListRefreshInterval}
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.serverListRefreshInterval, value)}>
                                <Picker.Item label="10 seconds" value="10000"/>
                                <Picker.Item label="30 seconds" value="30000"/>
                                <Picker.Item label="1 minute" value="60000"/>
                                <Picker.Item label="5 minutes" value="300000"/>
                                <Picker.Item label="10 minutes" value="30"/>
                                <Picker.Item label="20 minutes" value="30"/>
                            </Picker>
                        </View>
                    </View>
                </View>               
            </Container>
        );
    }

    updateSetting(key, value)
    {
        this.state.settings[key] = value;

        this.setState({settings: this.state.settings});

        AppSettings
            .setValue(key, value)
            .done();
    }
}

module.exports = SettingsScreen;
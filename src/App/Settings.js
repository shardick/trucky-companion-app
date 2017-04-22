import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    Button,
    Alert,
    Switch,
    Picker,
    ScrollView,
    StyleSheet
} = ReactNative;

import Container from '../Container';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar} from 'react-native-material-ui';
import RNRestart from 'react-native-restart';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';

class SettingsScreen extends BaseTruckyComponent
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
        var settings = await this
            .AppSettings
            .getSettings();

        this.setState({settings: settings});
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.LocaleManager.strings.routeSettingsTitle}/>);
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={{
                    marginTop: 10
                }}>
                    <View style={this.StyleManager.styles.appSettingsHeader}>
                        <Text style={this.StyleManager.styles.appSettingsHeaderText}>{this.LocaleManager.strings.enableAutoRefresh}</Text>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.autoRefreshGameTime}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(this.AppSettings.keys.autoRefreshGameTime, value)}
                                value={this.state.settings.autoRefreshGameTime}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.autoRefreshServersList}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(this.AppSettings.keys.autoRefreshServersList, value)}
                                value={this.state.settings.autoRefreshServersList}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsHeader}>
                        <Text style={this.StyleManager.styles.appSettingsHeaderText}>{this.LocaleManager.strings.refreshServersListEvery}</Text>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRowColumns}>
                        <View style={this.StyleManager.styles.appSettingsFieldBelow}>
                            <Picker
                                itemStyle={this.StyleManager.styles.appSettingsPicker}
                                selectedValue={this.state.settings.serverListRefreshInterval}
                                onValueChange={(value) => this.updateSetting(this.AppSettings.keys.serverListRefreshInterval, value)}>
                                <Picker.Item label={this.LocaleManager.strings.seconds10} value="10000"/>
                                <Picker.Item label={this.LocaleManager.strings.seconds30} value="30000"/>
                                <Picker.Item label={this.LocaleManager.strings.minute} value="60000"/>
                                <Picker.Item label={this.LocaleManager.strings.minutes5} value="300000"/>
                                <Picker.Item label={this.LocaleManager.strings.minutes10} value="30"/>
                                <Picker.Item label={this.LocaleManager.strings.minutes20} value="30"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsHeader}>
                        <Text style={this.StyleManager.styles.appSettingsHeaderText}>{this.LocaleManager.strings.settingsHeaderLanguage}</Text>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRowColumns}>
                        <View style={this.StyleManager.styles.appSettingsFieldBelow}>
                            <Picker
                                itemStyle={this.StyleManager.styles.appSettingsPicker}
                                selectedValue={this.state.settings.language}
                                onValueChange={(value) => this.updateSetting(this.AppSettings.keys.language, value)}>
                                <Picker.Item label={this.LocaleManager.strings.bulgarian} value="bg"/>
                                <Picker.Item label={this.LocaleManager.strings.french} value="fr"/>  
                                <Picker.Item label={this.LocaleManager.strings.finnish} value="fi"/>  
                                <Picker.Item label={this.LocaleManager.strings.english} value="en"/>
                                <Picker.Item label={this.LocaleManager.strings.italian} value="it"/>
                            </Picker>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    updateSetting(key, value)
    {
        var restartApp = false;

        if (key == 'language' && value != this.state.settings.language) {
            restartApp = true;
        }

        this.state.settings[key] = value;

        this.setState({settings: this.state.settings});

        this
            .AppSettings
            .setValue(key, value)
            .then(() => {

                if (restartApp) {
                    Alert.alert('Settings changed', 'Restart app to apply changes', [
                        {
                            text: 'Restart now',
                            onPress: () => RNRestart.Restart()
                        }
                    ]);
                }
            });

    }
}

module.exports = SettingsScreen;
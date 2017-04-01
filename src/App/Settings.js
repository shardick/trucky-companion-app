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

var styles = require('../Styles');
var AppSettings = require('../AppSettings');

import LocaleManager from '../Locales/LocaleManager';

import RNRestart from 'react-native-restart';

var lc = new LocaleManager();

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

/*styles.imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:20,
    height:24,
    justifyContent:'center'
  };*/

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
            centerElement={lc.strings.routeSettingsTitle}/>);
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={{
                    marginTop: 10
                }}>
                    <View style={styles.appSettingsHeader}>
                        <Text style={styles.appSettingsHeaderText}>{lc.strings.enableAutoRefresh}</Text>
                    </View>
                    <View style={styles.appSettingsRow}>
                        <Text style={styles.appSettingsLabel}>{lc.strings.autoRefreshGameTime}</Text>
                        <View style={styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshGameTime, value)}
                                value={this.state.settings.autoRefreshGameTime}/>
                        </View>
                    </View>
                    <View style={styles.appSettingsRow}>
                        <Text style={styles.appSettingsLabel}>{lc.strings.autoRefreshServersList}</Text>
                        <View style={styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshServersList, value)}
                                value={this.state.settings.autoRefreshServersList}/>
                        </View>
                    </View>
                    <View style={styles.appSettingsHeader}>
                        <Text style={styles.appSettingsHeaderText}>{lc.strings.refreshServersListEvery}</Text>
                    </View>
                    <View style={styles.appSettingsRowColumns}>
                        <View style={styles.appSettingsFieldBelow}>
                            <Picker
                                itemStyle={styles.appSettingsPicker}
                                selectedValue={this.state.settings.serverListRefreshInterval}
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.serverListRefreshInterval, value)}>
                                <Picker.Item label={lc.strings.seconds10} value="10000"/>
                                <Picker.Item label={lc.strings.seconds30} value="30000"/>
                                <Picker.Item label={lc.strings.minute} value="60000"/>
                                <Picker.Item label={lc.strings.minutes5} value="300000"/>
                                <Picker.Item label={lc.strings.minutes10} value="30"/>
                                <Picker.Item label={lc.strings.minutes20} value="30"/>
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.appSettingsHeader}>
                        <Text style={styles.appSettingsHeaderText}>{lc.strings.settingsHeaderLanguage}</Text>
                    </View>
                    <View style={styles.appSettingsRowColumns}>
                        <View style={styles.appSettingsFieldBelow}>
                            <Picker
                                itemStyle={styles.appSettingsPicker}
                                selectedValue={this.state.settings.language}
                                onValueChange={(value) => this.updateSetting(AppSettings.keys.language, value)}>
                                <Picker.Item label={lc.strings.english} value="en"/>
                                <Picker.Item label={lc.strings.italian} value="it"/>
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
            .then(() => {

                if (key == 'language')
                {
                    RNRestart.Restart();
                }         
            });

    }
}

const stylesX = StyleSheet.create({
    imageStyle: {
        marginLeft: 15,
        marginRight: 20,
        alignSelf: 'center',
        width: 20,
        height: 24,
        justifyContent: 'center'
    }
});

module.exports = SettingsScreen;
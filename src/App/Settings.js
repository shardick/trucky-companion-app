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

import {
    Toolbar
} from 'react-native-material-ui';

var styles = require('../Styles');
var AppSettings = require('../AppSettings');

import SettingsList from 'react-native-settings-list';

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
                    <View style={styles.appSettingsHeader}> 
                        <Text style={styles.appSettingsHeaderText}>Enable auto refresh</Text>
                    </View>
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
                     <View style={styles.appSettingsHeader}> 
                        <Text style={styles.appSettingsHeaderText}>Refresh servers list every</Text>
                    </View>
                    <View style={styles.appSettingsRowColumns}>                        
                        <View style={styles.appSettingsFieldBelow}>
                            <Picker itemStyle={styles.appSettingsPicker}
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

{/*                 <View style={{backgroundColor:'#f6f6f6',flex:1}}>
        <View style={{backgroundColor:'#f6f6f6',flex:1}}>
          <SettingsList borderColor='#d6d5d9' defaultItemSize={50}>              
            <SettingsList.Item
              hasNavArrow={false}
              title='Auto refresh settings'
              titleStyle={{color:'#009688', marginBottom:10, fontWeight:'500'}}
              itemWidth={50}
              borderHide={'Both'}
            />
            <SettingsList.Item
              icon={
                <View style={stylesX.imageStyle}>
                    <Icon name="clock-o" />
                </View>
              }
              hasNavArrow={false}
              hasSwitch={true}
              switchState={this.state.settings.autoRefreshGameTime}
              itemWidth={70}
              titleStyle={{color:'black', fontSize: 16}}
              title='Auto refresh game time'
              switchOnValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshGameTime, value)}
            />
            <SettingsList.Item
            icon={
                <View style={stylesX.imageStyle}>
                    <Icon name="cloud" />
                </View>
              }
              hasNavArrow={false}
              title='Auto refresh servers list'
              titleStyle={{color:'black', fontSize: 16}}
              itemWidth={70}

              hasSwitch={true}
              switchState={this.state.settings.autoRefreshServersList}
              switchOnValueChange={(value) => this.updateSetting(AppSettings.keys.autoRefreshServersList, value)}
            />     
            <SettingsList.Item
            icon={
                <View style={stylesX.imageStyle}>
                    <Icon name="cloud" />
                </View>
              }
              hasNavArrow={false}
              title='Server list refresh interval'
              titleStyle={{color:'black', fontSize: 16}}
              itemWidth={70}
              borderHide={'Both'}
            />       
             <SettingsList.Item     
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
                            </SettingsList.Item>
          </SettingsList>
        </View>
      </View>*/}
                   
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

const stylesX = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    marginRight:20,
    alignSelf:'center',
    width:20,
    height:24,
    justifyContent:'center'
  }
});

module.exports = SettingsScreen;
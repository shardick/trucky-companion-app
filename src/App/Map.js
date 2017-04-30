import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    ScrollView,
    Image,
    Linking,
    TouchableHighlight,
    TouchableOpacity,
    Picker,
    TextInput,
    StyleSheet,
    ListView,
    Switch
} = ReactNative;
import Container from '../Container';
import {Toolbar, Button, ActionButton} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import MapManager from '../Maps/MapManager';
import WebViewBridge from 'react-native-webview-bridge';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import TruckersMPAPI from '../Services/TruckersMPAPI';
import Autocomplete from 'react-native-autocomplete-input';

const injectScript = `
  (function () {
                    if (WebViewBridge) {
                        
                        WebViewBridge.onMessage = function (messageString) {
                            
                            var message = JSON.parse(messageString);

                            switch (message.messageType)
                            {
                                case 'viewPoi':
                                    zoom = message.zoom;
                                    viewPoi(message.id);
                                    break;
                                case 'setServer':
                                    zoom = 0.6;                                    
                                    setServer(message.id);
                                    break;
                                case 'updateSettings':

                                    var mapSettings = message.mapSettings;

                                    $('#heatmap').prop('checked', mapSettings.hideHeatMap);
                                    toggleHeatmap();
                                    $('#truck_face').prop('checked', mapSettings.showDirection);
                                    $('#truck_box').prop('checked', mapSettings.showTrucks);
                                    $('#name_show').prop('checked', mapSettings.showName);
                                    $('#name_show_id').prop('checked', mapSettings.showID);

                                    WebViewBridge.send(JSON.stringify({ messageType: 'debug', message: JSON.stringify(mapSettings)}));
                                    
                                    break;
                            }
                        };

                        $('.leftSidebar').hide(); 
                        zoom = 0.6;
                        viewPoi(3474);
                        WebViewBridge.send(JSON.stringify({ messageType: 'mapStart'}));                    
                    }
                  }());
`;

/**
 *
 *
 * @class MapScreen
 * @extends {BaseTruckyComponent}
 */
class MapScreen extends BaseTruckyComponent
{

    /**
     * Creates an instance of MapScreen.
     *
     * @memberOf MapScreen
     */
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            loading: true,
            showMap: false,
            pois: [],
            servers: [],
            selectedServer: 4,
            selectedPoi: -1,
            filteredPois: ds,
            showFilter: false,
            showSettings: false,
            showSettingsButton: true,
            mapSettings: {
                hideHeatMap: true,
                showDirection: false,
                showTrucks: true,
                showName: false,
                showID: false
            }
        }
    }

    openSearchDialog()
    {
        this.setState({showMap: false, showFilter: true, showSettingsButton: false, showSettings: false});
      /*  this
            .popupDialog
            .show();*/
    }
    
    innerNavigation()
    {
        if (this.state.showMap)
            this.props.navigator.pop();
        else if (this.state.showFilter)
            this.setState({showMap: true, showFilter: false, showSettings: false, showSettingsButton: true});
        else if (this.state.showSettings)
            this.setState({showMap: true, showFilter: false, showSettings: false, showSettingsButton: true});
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={this.innerNavigation.bind(this)}
            centerElement={this.LocaleManager.strings.liveMapRouteTitle}
            rightElement="filter-list"
            onRightElementPress={() => this.openSearchDialog()}/>);
    }

    onBridgeMessage(messageString)
    {
        var message = JSON.parse(messageString);        

        switch (message.messageType) {
            case 'mapStart':
                this.setState({loading: false, showMap: true});
                this.sendUpdateMapSettings();
                break;
            case 'debug':
                console.warn(messageString);
                break;
        }
    }

    async fetchData()
    {
        var mapManager = new MapManager();
        var pois = await mapManager.getPois();

        this.setState({pois: pois});

        var api = new TruckersMPAPI();
        var servers = await api.servers();

        this.setState({servers: servers});
    }

    serverSelected(id)
    {        
        this.setState({selectedServer: id});

        var mapManager = new MapManager();
        var serverID = mapManager.getServerID(id);
        const {webviewbridge} = this.refs;
        webviewbridge.sendToBridge(JSON.stringify({messageType: 'setServer', id: serverID}));
        this.setState({showMap: true, showFilter: false});
    }

    poiSelected(rowData)
    {
        this.setState({selectedPoi: rowData.index});

        const {webviewbridge} = this.refs;

        var zoom = 0.6;

        switch(rowData.type)
        {
            case 'Country':            
                zoom = 0.1;
                break;
            case 'City':
                zoom = 0.5;
                break;
            default:
                zoom = 1;
                break;
        }
        
        webviewbridge.sendToBridge(JSON.stringify({messageType: 'viewPoi', id: rowData.index, zoom: zoom}));

        this.setState({showMap: true, showFilter: false});
    }

    filterPoi(query)
    {
        if (query === '') {
            return [];
        }

        //console.warn(query);
        const regex = new RegExp(`${query.trim()}`, 'i');
        var filteredPois = this
            .state
            .pois
            .filter(poi => poi.search.toLowerCase().indexOf(query.toLowerCase()) >= 0);
        //console.warn(JSON.stringify(filteredPois));

        this.setState({
            filteredPois: this
                .state
                .filteredPois
                .cloneWithRows(filteredPois)
        });
    }

    renderFilteredPoi(rowData)
    {
        var spacer = "";

        for (var i = 0; i < rowData.depth; i++)
        {
            spacer += "      ";
        }

        return (
            <View style={{marginBottom: 5, marginTop: 5}}>
                <TouchableOpacity onPress={() => this.poiSelected(rowData)}>
                    <Text>{spacer}{rowData.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderDialog()
    {
        let serversItems = this
            .state
            .servers
            .map((s) => {
                return <Picker.Item
                    key={s.id}
                    value={s.id}
                    label={s.name + ' - ' + s.shortname + ' (' + s.game + ')'}/>
            });

        return (
            this.state.showFilter &&
                <View style={this.StyleManager.styles.meetupSearchFormContainer}>
                    <Text style={this.StyleManager.styles.meetupsSearchFormLabel}>Server</Text>
                    <Picker
                        style={this.StyleManager.styles.meetupsSearchFormField}
                        selectedValue={this.state.selectedServer}
                        onValueChange={(value) => this.serverSelected(value)}>
                        {serversItems}
                    </Picker>
                    <Text ref="autocompleteInput" style={this.StyleManager.styles.meetupsSearchFormLabel}>POIS</Text>
                    <TextInput onChangeText={(text) => this.filterPoi(text)}/>
                    <ListView
                        dataSource={this.state.filteredPois}
                        renderRow={this.renderFilteredPoi.bind(this)}></ListView>
                </View>            
        );
    }

    updateMapSettings(key, value)
    {
        this.state.mapSettings[key] = value;

        this.setState({ mapSettings: this.state.mapSettings});

        this.sendUpdateMapSettings();
    }

    sendUpdateMapSettings()
    {
        const {webviewbridge} = this.refs;

        webviewbridge.sendToBridge(JSON.stringify({messageType: 'updateSettings', mapSettings: this.state.mapSettings}));
    }


    renderSettingsView()
    {
        return(
            this.state.showSettings &&
            <View>
                 <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>Hide Heatmap</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('hideHeatMap', value)}
                                value={this.state.mapSettings.hideHeatMap}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>Show direction</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showDirection', value)}
                                value={this.state.mapSettings.showDirection}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>Show Box</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showTrucks', value)}
                                value={this.state.mapSettings.showTrucks}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>Show Name</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showName', value)}
                                value={this.state.mapSettings.showName}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>Show ID</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showID', value)}
                                value={this.state.mapSettings.showID}/>
                        </View>
                    </View>
            </View>);
    }

    render() {
        //var mapManager = new MapManager();
        return (
            <Container>                
                {this.renderToolbar()}
                {this.renderDialog()}
                {this.renderSettingsView()}
                {this.state.loading && <ActivityIndicator/>}
                <WebViewBridge
                    style={this.state.showMap
                    ? {}
                    : this.StyleManager.styles.hidden}
                    ref="webviewbridge"
                    onBridgeMessage={this
                    .onBridgeMessage
                    .bind(this)}
                    injectedJavaScript={injectScript}
                    source={{
                    uri: "https://ets2map.com/"
                }}/>
                {this.state.showSettingsButton &&
                <ActionButton icon="settings" onPress={() => this.setState({showMap: false, showFilter: false, showSettings: true, showSettingsButton: false})} /> 
                }
                <View style={{ alignItems: 'center', marginTop: 5, marginBottom: 5}}>
                    <TouchableOpacity onPress={() => this.navigateUrl('http://ets2map.com')}><Text>Credits: ETS2Map (http://ets2map.com)</Text></TouchableOpacity>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    }
});

module.exports = MapScreen;
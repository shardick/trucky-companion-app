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
    Switch,
    WebView
} = ReactNative;
import Container from '../Container';
import {Toolbar, Button, ActionButton} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import MapManager from '../Maps/MapManager';
//import WebViewBridge from 'react-native-webview-bridge';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import TruckyServices from '../Services/TruckyServices';
import AdaptativeModalPicker from '../Components/AdapativePicker';

const injectScript = `
var truckSelected = false;
var truckSelectionInterval;

function setTruckClicked(playerID)
{
    if (trucks[playerID])
    {
        truckClicked = playerID;
        truckSelected = true;
        clearInterval(truckSelectionInterval);
    }
}

$(document).ready(function() {

        document.addEventListener('message', function (e) {
    
        var message = JSON.parse(e.data);

        window.postMessage(JSON.stringify({ messageType: 'debug', message: message}));

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
                
            break;
            case 'viewUser':               

                    zoom = 1;
                    setServer(message.serverID);
                    cameraX = message.playerData.x;
                    cameraY = message.playerData.y;

                    truckSelectionInterval = setInterval(function() {
                        setTruckClicked(message.playerData.mp_id);
                    }, 20);
            break;
            case 'mapInitialState':
                zoom = 0.6;
                viewPoi(3474);
                break;
        }
    });

    $('.leftSidebar').hide(); 
    $('#truck_face').prop('checked', true);

    setTimeout(function() {
        window.postMessage(JSON.stringify({messageType: 'mapStart' }));                    
    }, 1000);    

});
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
                showDirection: true,
                showTrucks: true,
                showName: false,
                showID: true
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
            this.RouteManager.pop();
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

    onBridgeMessage(event)
    {
        console.warn(event.nativeEvent.data);        

        var message = JSON.parse(event.nativeEvent.data);        

        switch (message.messageType) {
            case 'mapStart':
                this.setState({loading: false, showMap: true});

                var instance = this;

                this.AppSettings.getSettings()
                    .then( (settings) => {
                        
                        //console.warn(settings.mapSettings);

                        if (settings.mapSettings)
                        {
                            //console.warn('set mapSettings on state');
                            instance.setState({mapSettings: settings.mapSettings});
                        }
                        else
                        {
                            settings.mapSettings = instance.state.mapSettings;
                            instance.AppSettings.saveSettings(settings);
                        }

                        if (this.props.data)
                        {
                            instance.state.showName = true;
                        }
                        
                        //console.warn('sendUpdateSettings on startMap');
                        this.sendUpdateMapSettings();
                    });

                if (this.props.data)
                {
                    this.sendMessage('viewUser', { playerData: this.props.data, serverID: this.props.data.server });                    
                }
                else
                {
                    this.sendMessage('mapInitialState');
                }

                break;
            case 'debug':
                console.warn(JSON.stringify(message.message));
                break;
        }
    }

    async fetchData()
    {
        var instance = this;

        var api = new TruckyServices();
        api.pois().then( (pois) => {
            instance.setState({pois: pois.pois});
        });       

        api.servers().then((servers) => {
            instance.setState({servers: servers.servers});
        });        
    }

    sendMessage(messageType, messageObject)
    {
        const {webviewbridge} = this.refs;
        var message = Object.assign({messageType: messageType}, messageObject);

        webviewbridge.postMessage(JSON.stringify(message));        
    }

    serverSelected(id)
    {        
        this.setState({selectedServer: id});

        var mapManager = new MapManager();
        var serverID = mapManager.getServerID(id);
        const {webviewbridge} = this.refs;
        webviewbridge.postMessage(JSON.stringify({messageType: 'setServer', id: serverID}));
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
        
        webviewbridge.postMessage(JSON.stringify({messageType: 'viewPoi', id: rowData.index, zoom: zoom}));

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
            <View style={this.StyleManager.styles.mapPoiListItem}>
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
            .filter((s) => s.online)
            .map((s) => {
                return {
                    key: s.id, label: s.name + ' - ' + s.shortname + ' (' + s.game + ')'
                };
            });

        return (
            this.state.showFilter &&
                <View style={this.StyleManager.styles.mapFiltersContainer}>
                    <Text style={this.StyleManager.styles.meetupsSearchFormLabel}>{this.LocaleManager.strings.servers}</Text>
                   {/* <Picker
                        style={this.StyleManager.styles.meetupsSearchFormField}
                        selectedValue={this.state.selectedServer}
                        onValueChange={(value) => this.serverSelected(value)}>
                        {serversItems}
                    </Picker>*/}
                     <AdaptativeModalPicker 
                        data={serversItems} 
                        onChange={(value) => this.serverSelected(value.key)} 
                        initialText={this.LocaleManager.strings.servers} />

                    <Text ref="autocompleteInput" style={this.StyleManager.styles.meetupsSearchFormLabel}>{this.LocaleManager.strings.places}</Text>
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

        this.AppSettings.setValue(this.AppSettings.keys.mapSettings, this.state.mapSettings);

        this.sendUpdateMapSettings();
    }

    sendUpdateMapSettings()
    {
        const {webviewbridge} = this.refs;

        webviewbridge.postMessage(JSON.stringify({messageType: 'updateSettings', mapSettings: this.state.mapSettings}));
    }


    renderSettingsView()
    {
        return(
            this.state.showSettings &&
            <View style={this.StyleManager.styles.simpleFlex}>
                 <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.hideHeatMap}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('hideHeatMap', value)}
                                value={this.state.mapSettings.hideHeatMap}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.showDirection}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showDirection', value)}
                                value={this.state.mapSettings.showDirection}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.showTrucks}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showTrucks', value)}
                                value={this.state.mapSettings.showTrucks}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.showName}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showName', value)}
                                value={this.state.mapSettings.showName}/>
                        </View>
                    </View>
                    <View style={this.StyleManager.styles.appSettingsRow}>
                        <Text style={this.StyleManager.styles.appSettingsLabel}>{this.LocaleManager.strings.showID}</Text>
                        <View style={this.StyleManager.styles.appSettingsField}>
                            <Switch
                                onValueChange={(value) => this.updateMapSettings('showID', value)}
                                value={this.state.mapSettings.showID}/>
                        </View>
                    </View>
            </View>);
    }

    render() {

        //console.warn(JSON.stringify(this.props.data));
        //var mapManager = new MapManager();
        return (
            <Container>                
                {this.renderToolbar()}
                {this.renderDialog()}
                {this.renderSettingsView()}
                {this.state.loading && <ActivityIndicator/>}
                <WebView
                    style={this.state.showMap ? {} : this.StyleManager.styles.hidden}
                    ref="webviewbridge"
                    onMessage={this.onBridgeMessage.bind(this)}
                    injectedJavaScript={injectScript}
                    source={{ uri: "https://ets2map.com/" }}/>
                {this.state.showMap &&
                <ActionButton icon="settings" onPress={() => this.setState({showMap: false, showFilter: false, showSettings: true, showSettingsButton: false})} /> 
                }
                <View style={this.StyleManager.styles.mapCredits}>
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
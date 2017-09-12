import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBar from 'react-native-progress/Bar';
import Container from '../Container';

var ReactNative = require('react-native');
var {
    ListView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    AppState
} = ReactNative;

import {Toolbar, ActionButton, Card} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';
import BottomNavigation from '../Components/BottomNavigation';

class ServersScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            loading: true,
            gameTime: '',
            servers: {
                totalPlayers: 0
            }
        };
        this.settings = {};
    }

    componentDidMount() {

        super.componentDidMount();

        this
            .setTimers()
            .done();
    }

    async setTimers()
    {
        this.settings = await this.AppSettings.getSettings();

        var instance = this;

        if (this.settings.autoRefreshGameTime) {
            this.state.refreshTimer = setInterval(function () {

                if (AppState.currentState == 'active' && instance.getCurrentRoute().routeName == 'servers')
                {
                    //console.log('time');

                    if (!instance.state.loading) {
                        instance
                            .setGameTime()
                            .done();
                    }
                }
            }, 10000);
        }
    }

    componentWillUnmount() {

        super.componentWillUnmount();

        if (this.state.refreshTimer != null) {
            clearInterval(this.state.refreshTimer);
        }
    }

    async fetchData() {

        this.setState({loading: true});

        var api = new TruckyServices();

        var servers = await api.servers();

        if (servers != null)
        {
            this.setState({servers: servers });
            
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(servers.servers)
            });
        }

        await this.setGameTime();

        this.setState({loading: false});
    }

    async setGameTime()
    {
        var api = new TruckyServices();

        var gameTime = await api.game_time();

        if (gameTime != null)
        {
            this.setState({gameTime: gameTime});
        }
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    renderRow(rowData) {
        var fill = rowData.players / rowData.maxplayers;
        var progressBarColor = 'green';

        if (fill > 0.5) 
            progressBarColor = 'orange';
        
        if (fill > 0.8) 
            progressBarColor = 'red';
        
        return (

            <Card>
                <View
                    style={rowData.online
                    ? this.StyleManager.styles.serversListRowHeaderOnline
                    : this.StyleManager.styles.serversListRowHeaderOffline}>
                    <Text style={this.StyleManager.styles.serversListRowHeaderText}>{rowData.name}
                        <Text style={this.StyleManager.styles.serversListRowHeaderLittleText}>
                            &nbsp;({rowData.shortname})</Text>
                    </Text>
                    <Text>{rowData.game}</Text>
                </View>
                {rowData.online && <View style={this.StyleManager.styles.serversListStatusContainer}>
                    <Text style={this.StyleManager.styles.serversListOnlinePlayers}>{rowData.players}
                        &nbsp;{this.LocaleManager.strings.playersOnline}
                        <Text style={this.StyleManager.styles.serversListServerSize}>&nbsp;/ {rowData.maxplayers}</Text>
                    </Text>
                    {rowData.online && <View style={this.StyleManager.styles.serversListProgressBarContainer}>
                        <ProgressBar progress={fill} color={progressBarColor} width={200}/>
                    </View>
}
                </View>
}
                <View style={this.StyleManager.styles.serversListDescriptionRow}>
                    <Icon name="pause" style={this.StyleManager.styles.serversListDescriptionIcon}/>
                    <Text>{rowData.queue} {this.LocaleManager.strings.playersInQueue}</Text>
                </View>
                <View style={this.StyleManager.styles.serversListDescriptionRow}>
                    <Icon name="cloud" style={this.StyleManager.styles.serversListDescriptionIcon}/>
                    <Text>{rowData.online
                            ? this.LocaleManager.strings.online
                            : this.LocaleManager.strings.offline}</Text>
                </View>
                <View style={this.StyleManager.styles.serversListDescriptionRow}>
                    <Icon name="shield" style={this.StyleManager.styles.serversListDescriptionIcon}/>
                    <Text>{rowData.speedlimiter
                            ? this.LocaleManager.strings.speedLimiterEnabled
                            : this.LocaleManager.strings.speedLimiterDisabled}</Text>
                </View>
                <View style={this.StyleManager.styles.serversListDescriptionRow}>
                    <Icon name="car" style={this.StyleManager.styles.serversListDescriptionIcon}/>
                    <Text>{rowData.carsforplayers
                            ? this.LocaleManager.strings.carsForPlayersEnabled
                            : this.LocaleManager.strings.carsForPlayersDisabled}</Text>
                </View>
                <View style={this.StyleManager.styles.serversListDescriptionRow}>
                    <Icon name="bomb" style={this.StyleManager.styles.serversListDescriptionIcon}/>
                    <Text>{rowData.carsforplayers
                            ? this.LocaleManager.strings.collisionsEnabled
                            : this.LocaleManager.strings.collisionsDisabled}</Text>
                </View>
            </Card>
        );
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            rightElement="refresh"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.routeServersTitle}
            onRightElementPress={() => this.fetchData().done()}/>);
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={this.StyleManager.styles.serversListMainContainer}>
                    {this.state.loading && <ActivityIndicator />}
                    <View
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : {}}>
                        <View style={this.StyleManager.styles.serversListGameTimeContainer}>
                            <View style={this.StyleManager.styles.simpleRow}>
                                <Icon style={this.StyleManager.styles.serversListTotalPlayersOnlineIcon} name="user"/>
                                <Text style={this.StyleManager.styles.serversListTotalPlayersOnline}>{this.state.servers.totalPlayers}</Text>
                                <Icon style={this.StyleManager.styles.serversListGameTimeIcon} name="clock-o"/>
                                <Text style={this.StyleManager.styles.serversListGameTimeText}>{this.LocaleManager.moment(this.state.gameTime.calculated_game_time).format('dddd HH:mm')}</Text>
                            </View>
                        </View>
                        <ListView
                            style={this.StyleManager.styles.list}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow.bind(this)}
                            automaticallyAdjustContentInsets={false}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={this.StyleManager.styles.separator}/>}
                            refreshControl={< RefreshControl refreshing = {
                            this.state.loading
                        }
                        onRefresh = {
                            this
                                ._onRefresh
                                .bind(this)
                        } />}/>                        
                    </View>                    
                </View>
                <BottomNavigation navigation={this.props.navigation} active="servers" />
            </Container>
        )
    }
}

//ServersScreen.propTypes = propTypes;

module.exports = ServersScreen;
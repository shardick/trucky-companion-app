import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBar from 'react-native-progress/Bar';
import Container from '../Container';
var AppBottomNavigation = require('../Components/BottomNavigation');

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
import styles from '../Styles';
import AppSettings from '../AppSettings';
import TruckersMPApi from '../Services/TruckersMPAPI';
import routes from '../routes';

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

class ServersScreen extends Component
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
            api: new TruckersMPApi(),
            gameTime: ''
        };
        this.settings = {};
    }

    componentDidMount() {

        AppState.addEventListener('change', this._handleAppStateChange);

        this
            .fetchData()
            .done();

        this
            .setTimers()
            .done();
    }

    async setTimers()
    {
        this.settings = await AppSettings.getSettings();

        var instance = this;

        if (this.settings.autoRefreshGameTime) {
            this.state.refreshTimer = setInterval(function () {

                if (!instance.state.loading) {
                    instance
                        .setGameTime()
                        .done();
                }
            }, 10000);
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);

        if (this.state.refreshTimer != null) {
            clearInterval(this.state.refreshTimer);
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this.fetchData();
        }
    }

    async fetchData() {

        this.setState({loading: true});
        var servers = await this
            .state
            .api
            .servers();

        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(servers)
        });

        await this.setGameTime();

        this.setState({loading: false});
    }

    async setGameTime()
    {
        var gameTime = await this
            .state
            .api
            .game_time_formatted();

        this.setState({gameTime: gameTime});
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
                    ? styles.serversListRowHeaderOnline
                    : styles.serversListRowHeaderOffline}>
                    <Text style={styles.serversListRowHeaderText}>{rowData.name}
                        <Text style={styles.serversListRowHeaderLittleText}>
                            &nbsp;({rowData.shortname})</Text>
                    </Text>
                    <Text>{rowData.game}</Text>
                </View>
                {rowData.online && <View style={styles.serversListStatusContainer}>
                    <Text style={styles.serversListOnlinePlayers}>{rowData.players}
                        &nbsp;truckers
                        <Text style={styles.serversListServerSize}>&nbsp;/ {rowData.maxplayers}</Text>
                    </Text>
                    {rowData.online && <View style={styles.serversListProgressBarContainer}>
                        <ProgressBar progress={fill} color={progressBarColor} width={200}/>
                    </View>
}
                </View>
}
                <View style={styles.serversListDescriptionRow}>
                    <Icon name="pause" style={styles.serversListDescriptionIcon}/>
                    <Text>{rowData.queue}&nbsp;players in queue</Text>
                </View>
                <View style={styles.serversListDescriptionRow}>
                    <Icon name="cloud" style={styles.serversListDescriptionIcon}/>
                    <Text>Status</Text>
                    <Text>{rowData.online
                            ? ' online'
                            : ' offline'}</Text>
                </View>
                <View style={styles.serversListDescriptionRow}>
                    <Icon name="shield" style={styles.serversListDescriptionIcon}/>
                    <Text>Speed limiter</Text>
                    <Text>{rowData.speedlimiter
                            ? ' enabled'
                            : ' disabled'}</Text>
                </View>
            </Card>
        );
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            rightElement="refresh"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.props.route.title}
            onRightElementPress={() => this.fetchData().done()}/>);
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={styles.serversListMainContainer}>
                    {this.state.loading && <ActivityIndicator />}
                    <View
                        style={this.state.loading
                        ? styles.hidden
                        : {}}>
                        <View style={styles.serversListGameTimeContainer}>
                            <View style={styles.simpleRow}>
                                <Icon style={styles.serversListGameTimeIcon} name="clock-o"/>
                                <Text style={styles.serversListGameTimeText}>{this.state.gameTime}</Text>
                            </View>
                        </View>
                        <ListView
                            style={styles.list}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            automaticallyAdjustContentInsets={false}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator}/>}
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
            </Container>
        )
    }
}

ServersScreen.propTypes = propTypes;

module.exports = ServersScreen;
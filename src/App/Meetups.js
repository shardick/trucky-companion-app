import React, {Component} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    ScrollView,
    ActivityIndicator,
    ListView,
    AppState,
    RefreshControl,
    Picker,
    Button,
    Linking
} = ReactNative;
import Markdown from 'react-native-simple-markdown'
import Container from '../Container';
var AppBottomNavigation = require('../Components/BottomNavigation');
import {Toolbar, Card} from 'react-native-material-ui';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';

var styles = require('../Styles');
var AppSettings = require('../AppSettings');
import EventsAPI from '../Services/EventsAPI';
import TruckersAPI from '../Services/TruckersMPAPI';

class RulesScreen extends Component
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
            api: new EventsAPI(),
            truckersApi: new TruckersAPI(),
            loading: true,
            showDialog: false,
            showList: true,
            servers: [
                {
                    name: 'Select a server',
                    shortname: 'xx'
                }
            ]
        };
    }

    componentDidMount()
    {
        AppState.removeEventListener('change', this._handleAppStateChange);

        this.fetchData();
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

    async fetchData()
    {
        this.setState({loading: true, showList: false});

        var meetups = await this
            .state
            .api
            .events();

        var servers = await this
            .state
            .truckersApi
            .servers();

        this.setState({servers: servers});

        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(meetups)
        });

        this.setState({loading: false, showList: true});
    }

    openSearchDialog()
    {
        this.setState({showList: false});
        this
            .popupDialog
            .show();
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement={this.props.route.title}
            rightElement="search"
            onRightElementPress={() => this.openSearchDialog()}/>);
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    navigateMeetup(url)
    {
        Linking
            .canOpenURL('http://ets2c.com/' + url)
            .then(supported => {
                if (supported) {
                    Linking.openURL('http://ets2c.com/' + url);
                } else {
                    console.log('Don\'t know how to open URI: https://truckersmp.com');
                }
            });
    }

    renderRow(rowData, instance) {
        return (
            <Card onPress={() => instance.navigateMeetup(rowData.url)}>
                <View style={styles.meetupsRowContainer}>
                    <View style={styles.serversListDescriptionRow}>
                        <Text style={styles.meetupsRowTitle}>{rowData.location}</Text>
                        <Text style={styles.meetupRowTitleTime}>&nbsp;{rowData.time}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="globe" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.server}
                            - Lang: {rowData.language}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="users" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.participants}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="user" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.author}</Text>
                    </View>
                </View>
            </Card>
        );
    }

    serversList()
    {
        return this
            .state
            .servers
            .map((server) => {
                return (< Picker.Item label = {
                    server.name
                }
                label = {
                    server.shortname
                } />);
            });
    }

    renderDialog()
    {
        return (
            <PopupDialog
                dialogTitle={< DialogTitle title = "Filter events" />}
                ref={(popupDialog) => {
                this.popupDialog = popupDialog;
            }}
                width={0.9}
                height={200}
                onDismissed={() => this.setState({showList: true})}>
                <View>
                    <Text>Server</Text>
                    <Picker>
                        {this.serversList()}</Picker>
                    <Text>Language</Text>
                    <Button title="Search"/>
                </View>
            </PopupDialog>
        );
    }
    render() {
        return (
            <Container>
                {this.renderDialog()}
                {this.renderToolbar()}

                <View style={styles.serversListMainContainer}>
                    {this.state.loading && <ActivityIndicator
                        style={[
                        styles.loader, {
                            transform: [
                                {
                                    scale: 1.5
                                }
                            ]
                        }
                    ]}
                        size="large"/>
}
                    <View
                        style={!this.state.loading && this.state.showList
                        ? {}
                        : styles.hidden}>
                        <ListView
                            style={styles.list}
                            dataSource={this.state.dataSource}
                            renderRow={(rowData) => this.renderRow(rowData, this)}
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

module.exports = RulesScreen;
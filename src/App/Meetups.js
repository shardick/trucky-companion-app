import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    ScrollView,
    ListView,
    AppState,
    RefreshControl,
    Picker,
    Linking,
    Alert
} = ReactNative;
import Markdown from 'react-native-simple-markdown'
import Container from '../Container';
var AppBottomNavigation = require('../Components/BottomNavigation');
import {Toolbar, Card, Button, ActionButton } from 'react-native-material-ui';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import RNCalendarEvents from 'react-native-calendar-events';

var styles = require('../Styles');
var AppSettings = require('../AppSettings');
import EventsAPI from '../Services/EventsAPI';
import TruckersAPI from '../Services/TruckersMPAPI';

import LocaleManager from '../Locales/LocaleManager';

var lc = new LocaleManager();

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

class MeetupsScreen extends Component
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
            meetups: [],
            loading: true,
            showDialog: false,
            showList: true,
            servers: [
                {
                    name: 'Select a server',
                    shortname: 'xx'
                }
            ],
            /*languages: ['Doesn\'t matter'],*/
            selectedServer: '',
            selectedLanguage: ''
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

        this.setState({meetups: meetups});

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

        /*var languages = this
            .state
            .api
            .distinctLanguages(meetups);

        this.setState({languages: languages});*/

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
            centerElement={lc.strings.routeMeetupsTitle}
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

    addMeetupToCalendar(event)
    {
        RNCalendarEvents
            .authorizeEventStore()
            .then(status => {
                if (status == 'authorized') {

                    //console.log(JSON.stringify(event));

                    var eventSettings = {
                        location: event.location,
                        notes: lc.strings.formatString(lc.strings.eventNotes, event.author, event.server),
                        startDate: lc.moment(event.eventDate).local().format('YYYY-MM-DDTHH:mm:00.000')+'Z',
                        endDate: lc.moment(event.endDate).local().format('YYYY-MM-DDTHH:mm:00.000')+'Z',
                        alarms: [
                            {
                                date: lc.moment(event.eventDate)
                                    .add(-30, 'm')
                                    .local()
                                    .format('YYYY-MM-DDTHH:mm:00.000') + 'Z'
                            }
                        ]
                    };

                    //onsole.log(JSON.stringify(eventSettings));

                    RNCalendarEvents
                        .saveEvent(lc.strings.eventTitle, eventSettings)
                        .then(id => {

                            console.log('Event added to calendar: ' + id.toString());

                            Alert.alert(lc.strings.eventAddedToCalendar);
                        })
                        .catch(error => {
                            Alert.alert(error);
                        });
                }
            })
            .catch(error => {});
    }

    renderRow(rowData, instance) {
        return (
            <Card>
                <View style={styles.meetupsRowContainer}>
                    <View style={styles.serversListDescriptionRow}>
                        <Text style={styles.meetupsRowTitle}>{rowData.location}</Text>
                        <Text style={styles.meetupRowTitleTime}>&nbsp;{rowData.time}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="globe" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.server}
                            &nbsp;-&nbsp;{lc.strings.language}
                            {rowData.language}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="users" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.participants}</Text>
                    </View>
                    <View style={styles.serversListDescriptionRow}>
                        <Icon name="user" style={styles.serversListGameTimeIcon}/>
                        <Text style={styles.serversListGameTimeText}>{rowData.author}</Text>
                    </View>
                    <View style={styles.meetupsRowButtonContainer}>
                        <Button
                            primary
                            text={lc.strings.info}
                            onPress={() => instance.navigateMeetup(rowData.url)}/>
                        <Button
                            primary
                            text={lc.strings.addToCalendar}
                            onPress={() => instance.addMeetupToCalendar(rowData)}/>
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
                    server.name + ' - ' + server.shortname + ' (' + server.game + ')'
                }
                value = {
                    server.shortname
                } />);
            });
    }

    /*languagesList()
    {
        return this
            .state
            .languages
            .map((lang) => {
                return (< Picker.Item label = {
                    lang
                }
                value = {
                    lang
                } />);
            });
    }*/

    renderDialog()
    {
        return (
            <PopupDialog
                ref={(popupDialog) => {
                this.popupDialog = popupDialog;
            }}
                width={0.9}
                height={155}
                onDismissed={() => this.setState({showList: true})}>
                <View style={styles.meetupSearchFormContainer}>
                    <Text style={styles.meetupsSearchFormLabel}>Server</Text>
                    <Picker
                        style={styles.meetupsSearchFormField}
                        selectedValue={this.state.selectedServer}
                        onValueChange={(value) => this.setState({selectedServer: value})}>
                        {this.serversList()}</Picker>
                    {/*<Text style={styles.meetupsSearchFormLabel}>Language</Text>*/}
                    {/*<Picker
                        style={styles.meetupsSearchFormLabel}
                        selectedValue={this.state.selectedLanguage}
                        onValueChange={(value) => this.setState({selectedLanguage: value})}>
                        {this.languagesList()}
                    </Picker>*/}
                    <Button
                        text="Search"
                        icon="search"
                        raised
                        primary
                        onPress={() => this.filterSearch()}/>
                </View>
            </PopupDialog>
        );
    }

    filterSearch()
    {
        var searchResults = this
            .state
            .api
            .filterEvents(this.state.meetups, this.state.selectedServer, this.state.selectedLanguage);

        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(searchResults)
        });

        this.setState({showList: true});
        this
            .popupDialog
            .dismiss();
    }

    render() {
        return (
            <Container>
                {this.renderDialog()}
                {this.renderToolbar()}

                <View style={styles.meetupsListContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    <View
                        style={!this.state.loading && this.state.showList
                        ? {}
                        : styles.hidden}>
                        <ListView
                            style={styles.meetupsListList}
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
                <ActionButton icon="refresh" onPress={this._onRefresh.bind(this)} /> 
            </Container>
        )
    }
}

module.exports = MeetupsScreen;
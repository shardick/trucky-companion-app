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
import {Toolbar, Card, Button, ActionButton} from 'react-native-material-ui';
import PopupDialog, {DialogTitle} from 'react-native-popup-dialog';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import RNCalendarEvents from 'react-native-calendar-events';
import TruckyServices from '../Services/TruckyServices';
import AdaptativeModalPicker from '../Components/AdapativePicker';

import BaseTruckyComponent from '../Components/BaseTruckyComponent';

class MeetupsScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([]),
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
            selectedServer: 'EU #2',
            selectedLanguage: ''
        };
    }

    componentWillUnmount() {

        super.componentWillUnmount();

        if (this.state.refreshTimer != null) {
            clearInterval(this.state.refreshTimer);
        }
    }

    async fetchData()
    {
        this.setState({loading: true, showList: false});

        var api = new TruckyServices();

        var instance = this;

        api
            .events()
            .then((meetups) => {

                instance.setState({
                    dataSource: this
                        .state
                        .dataSource
                        .cloneWithRows(meetups)
                });

                instance.setState({meetups: meetups, loading: false, showList: true});
            });

        api
            .servers()
            .then((servers) => this.setState({servers: servers.servers}));
    }

    filterEvents(meetups, server, language)
    {
        var ret = new Array();

        meetups.forEach(function (element) {

            if (server != "") {
                if (element.server.indexOf(server.replace(' ', '')) > -1) {
                    ret.push(element);
                }
            }

        }, this);

        return ret;
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
            onLeftElementPress={() => this.RouteManager.pop()}
            centerElement={this.LocaleManager.strings.routeMeetupsTitle}
            rightElement="search"
            onRightElementPress={() => this.openSearchDialog()}/>);
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
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
                        notes: this
                            .LocaleManager
                            .strings
                            .formatString(this.LocaleManager.strings.eventNotes, event.author, event.server),
                        startDate: this
                            .LocaleManager
                            .moment(event.eventDate)
                            .local()
                            .format('YYYY-MM-DDTHH:mm:00.000') + 'Z',
                        endDate: this
                            .LocaleManager
                            .moment(event.endDate)
                            .local()
                            .format('YYYY-MM-DDTHH:mm:00.000') + 'Z',
                        alarms: [
                            {
                                date: this
                                    .LocaleManager
                                    .moment(event.eventDate)
                                    .add(-30, 'm')
                                    .local()
                                    .format('YYYY-MM-DDTHH:mm:00.000') + 'Z'
                            }
                        ]
                    };

                    //onsole.log(JSON.stringify(eventSettings));

                    RNCalendarEvents
                        .saveEvent(this.LocaleManager.strings.eventTitle, eventSettings)
                        .then(id => {

                            console.log('Event added to calendar: ' + id.toString());

                            Alert.alert(this.LocaleManager.strings.eventAddedToCalendar);
                        })
                        .catch(error => {
                            Alert.alert(error);
                        });
                }
            })
            .catch(error => {});
    }

    renderRow(rowData) {
        return (
            <Card>
                <View style={this.StyleManager.styles.meetupsRowContainer}>
                    <View style={this.StyleManager.styles.serversListDescriptionRow}>
                        <Text style={this.StyleManager.styles.meetupsRowTitle}>{rowData.location}</Text>
                        <Text style={this.StyleManager.styles.meetupRowTitleTime}>&nbsp;{rowData.time}</Text>
                    </View>
                    <View style={this.StyleManager.styles.serversListDescriptionRow}>
                        <Icon name="globe" style={this.StyleManager.styles.serversListGameTimeIcon}/>
                        <Text style={this.StyleManager.styles.serversListGameTimeText}>{rowData.server}
                            &nbsp;-&nbsp;{this.LocaleManager.strings.language} {rowData.language}</Text>
                    </View>
                    <View style={this.StyleManager.styles.serversListDescriptionRow}>
                        <Icon name="users" style={this.StyleManager.styles.serversListGameTimeIcon}/>
                        <Text style={this.StyleManager.styles.serversListGameTimeText}>{rowData.participants}</Text>
                    </View>
                    <View style={this.StyleManager.styles.serversListDescriptionRow}>
                        <Icon name="user" style={this.StyleManager.styles.serversListGameTimeIcon}/>
                        <Text style={this.StyleManager.styles.serversListGameTimeText}>{rowData.author}</Text>
                    </View>
                    <View style={this.StyleManager.styles.meetupsRowButtonContainer}>
                        <Button
                            primary
                            text={this.LocaleManager.strings.info}
                            onPress={() => this.navigateUrl('http://ets2c.com/' + rowData.url)}/>
                        <Button
                            primary
                            text={this.LocaleManager.strings.addToCalendar}
                            onPress={() => this.addMeetupToCalendar(rowData)}/>
                    </View>
                </View>
            </Card>
        );
    }

    serversList()
    {
       /* return this
            .state
            .servers
            .map((server) => {
                return (< Picker.Item label = {
                    server.name + ' - ' + server.shortname + ' (' + server.game + ')'
                }
                value = {
                    server.shortname
                } />);
            });*/

        return this.state.servers.map( (server) => {
            return { key: server.shortname, label: server.name + ' - ' + server.shortname + ' (' + server.game + ')' }
        });
    }

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
                <View style={this.StyleManager.styles.meetupSearchFormContainer}>
                    <Text style={this.StyleManager.styles.meetupsSearchFormLabel}>{this.LocaleManager.strings.servers}</Text>
                    {/*<Picker
                        style={this.StyleManager.styles.meetupsSearchFormField}
                        selectedValue={this.state.selectedServer}
                        onValueChange={(value) => this.setState({selectedServer: value})}>
                        {this.serversList()}</Picker>*/}
                     <View style={this.StyleManager.styles.pickerContainer}>
                    <AdaptativeModalPicker 
                        style={this.StyleManager.styles.meetupsSearchFormField}
                        data={this.serversList()} 
                        onChange={(value) => this.setState({selectedServer: value.key})} 
                        initialText={this.LocaleManager.strings.servers} />
                    </View>
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
        var searchResults = this.filterEvents(this.state.meetups, this.state.selectedServer, this.state.selectedLanguage);

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

                <View style={this.StyleManager.styles.meetupsListContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    <View
                        style={!this.state.loading && this.state.showList
                        ? {}
                        : this.StyleManager.styles.hidden}>
                        <ListView
                            style={this.StyleManager.styles.meetupsListList}
                            dataSource={this.state.dataSource}
                            renderRow={this
                            .renderRow
                            .bind(this)}
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
                <ActionButton
                    icon="refresh"
                    onPress={this
                    ._onRefresh
                    .bind(this)}/>
            </Container>
        )
    }
}

module.exports = MeetupsScreen;
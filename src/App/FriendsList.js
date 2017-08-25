import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    View,
    ScrollView,
    RefreshControl,
    AppState,
    ListView,
    Text,
    Image
} = ReactNative;
import Container from '../Container';
import {Toolbar, Card, Button} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';
import MapManager from '../Maps/MapManager';
import ProgressBar from 'react-native-progress/Bar';
import BottomNavigation from '../Components/BottomNavigation';

class FriendsListScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var friendsOnline = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        var friendsOffline = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            friendsOnline: friendsOnline.cloneWithRows([]),
            friendsOffline: friendsOnline.cloneWithRows([]),
            friends: new Array(),
            loading: true,
            api: new TruckyServices(),
            steamUserPresent: false,
            checkingOnlineState: false,
            friendsChecked: 0
        };
    }

    async fetchData()
    {
        this.setState({loading: true});

        var instance = this;

        this
            .state
            .api
            .servers()
            .then((servers) => {
                
                if (servers != null)
                {
                    instance.setState({servers: servers.servers});
                }

            });

        var settings = await this
            .AppSettings
            .getSettings();

        if (typeof(settings.steamUser) != 'undefined' && settings.steamUser != null) {
            var friends = await this
                .state
                .api
                .getFriends(settings.steamUser.steamID);
            
            if (friends != null)
            {
                this.setState({friends: friends});

                var tmpFriendsOffline = this.getOfflineFriends(friends);
                var tmpFriendsOnline = this.getOnlineFriends(friends);

                this.setState({
                    steamUserPresent: true,
                    friendsOffline: this
                        .state
                        .friendsOffline
                        .cloneWithRows(tmpFriendsOffline),
                    friendsOnline: instance
                                            .state
                                            .friendsOnline
                                            .cloneWithRows(tmpFriendsOnline),
                    loading: false,
                    checkingOnlineState: true
                });

                //var tmpFriendsOnline = new Array();

                var promises = new Array();

                for (var i = 0; i < friends.length; i++) {
                    if (friends[i].truckersMPUser) {

                        var promise = new Promise((resolve, reject) => {
                            var f = friends[i];
                            this
                                .state
                                .api
                                .isOnline(friends[i].truckersMPUser.id)
                                .then(function (onlineStatus) {

                                    f.onlineStatus = onlineStatus;

                                    tmpFriendsOnline = instance.getOnlineFriends(friends);
                                    tmpFriendsOffline = instance.getOfflineFriends(friends);

                                    instance.setState({
                                        friendsChecked: instance.state.friendsChecked + 1,
                                        friendsOffline: instance
                                            .state
                                            .friendsOffline
                                            .cloneWithRows(tmpFriendsOffline),
                                        friendsOnline: instance
                                            .state
                                            .friendsOnline
                                            .cloneWithRows(tmpFriendsOnline)
                                    });

                                    resolve();
                                });
                        });

                        promises.push(promise);
                    }
                }

                Promise
                    .all(promises)
                    .then((results) => {
                        this.setState({checkingOnlineState: false});
                    });
            }
            else
                this.setState({loading: false});
                
        } else {
            this.setState({loading: false});
        }
    }

    getOfflineFriends(friends)
    {
        var tmpFriendsOffline = friends.filter(function (f) {
            return f.truckersMPUser && ((f.steamUser.personastate != 1)); // && (f.onlineStatus && !f.onlineStatus.online))
        });

        return tmpFriendsOffline;
    }

    getOnlineFriends(friends)
    {
        var tmpFriendsOnline = friends.filter(function (f) {
            return f.truckersMPUser && f.steamUser.gameextrainfo && ((f.steamUser.personastate == 1) || (f.onlineStatus && f.onlineStatus.online));
        });

        return tmpFriendsOnline;
    }

    viewOnMap(playerData)
    {
        /*var mapRoute = Object.assign(this.RouteManager.routes.map, {data: playerData.onlineStatus});

        this
            .props
            .navigator
            .push(mapRoute);*/
        
        this.RouteManager.navigate('map', { data: playerData.onlineStatus });
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.friends}
            rightElement="refresh"
            onRightElementPress={() => this.fetchData().done()}/>);
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    onPop()
    {
        super.onPop();

        //console.warn('onPop');
        this
            .fetchData()
            .done();
    }

    renderFriendsList(list)
    {
        return (
            <ListView
                style={this.StyleManager.styles.friendsListList}
                dataSource={list}
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
        );
    }

    renderPersonaState(status)
    {
        switch (status) {
            case 0:
                return this.LocaleManager.strings.offlineOnSteam;
            case 1:
                return this.LocaleManager.strings.onlineOnSteam;
            case 2:
                return this.LocaleManager.strings.busyOnSteam;
            case 3:
                return this.LocaleManager.strings.awayOnSteam;
            case 4:
                return this.LocaleManager.strings.snoozingOnSteam;
            case 5:
                return this.LocaleManager.strings.lookingForATradeOnSteam;
            case 6:
                return this.LocaleManager.strings.lookingForPlayOnSteam;
        }
    }

    getServerName(onlineServerID)
    {
        //console.warn(onlineServerID);
        var map = new MapManager();
        var serverID = map.reserveServerID(onlineServerID);
        var server = this
            .state
            .servers
            .find((s) => {
                return s.id == serverID;
            });
        //console.warn(server);

        if (server) 
            return ' - ' + server.shortname;
        else 
            return '';
        }
    
    renderRow(rowData) {
        return (
            <Card>
                <View style={this.StyleManager.styles.friendsListRow}>
                    <View>
                        <Image
                            source={{
                            uri: rowData.truckersMPUser.avatar
                        }}
                            style={this.StyleManager.styles.friendsListProfileImage}/>
                    </View>
                    <View style={this.StyleManager.styles.friendsListUsernameContainer}>
                        <Text style={this.StyleManager.styles.friendListUsername}>{rowData.truckersMPUser.name}
                            &nbsp;({rowData.truckersMPUser.id})</Text>
                        {rowData.onlineStatus.online && <View>
                            <Text style={this.StyleManager.styles.playerOnline}>{this.LocaleManager.strings.online} {this.getServerName(rowData.onlineStatus.server)}</Text>
                        </View>
}
                        {!rowData.onlineStatus.online && <Text style={this.StyleManager.styles.offline}>{this.LocaleManager.strings.offline}</Text>}
                        {!rowData.onlineStatus.online && rowData.steamUser.personastate > 0 && <Text>{this.renderPersonaState(rowData.steamUser.personastate)}</Text>}
                        {rowData.steamUser.gameextrainfo && <Text>{rowData.steamUser.gameextrainfo}</Text>}
                    </View>
                </View>
                {rowData.onlineStatus.online && <View style={this.StyleManager.styles.meetupsRowButtonContainer}>
                    <Button
                        primary
                        icon="map"
                        text={this.LocaleManager.strings.viewOnMap}
                        onPress={() => this.viewOnMap(rowData)}/>
                </View>
}
            </Card>
        )
    }

    render()
    {
        var fill = (this.state.friendsChecked / this.state.friends.length);
        return (
            <Container>
                {this.renderToolbar()}
                <ScrollView style={this.StyleManager.styles.friendsListMainContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    {!this.state.loading && this.state.friends.length > 0 && this.state.checkingOnlineState && <View style={this.StyleManager.styles.friendsListCheckingStateContainer}>
                        <Text>{this.LocaleManager.strings.checkingOnlineState}</Text>
                        <View>
                            <ProgressBar progress={fill} color={this.StyleManager.styles.uiTheme.palette.primaryColor} width={200}/>
                        </View>
                    </View>
}

                    {!this.state.loading && !this.state.steamUserPresent && <View style={this.StyleManager.styles.friendsListLoginToSteamContainer}>
                        <Button
                            primary
                            raised
                            text={this.LocaleManager.strings.loginToSteam}
                            onPress={() => this.RouteManager.navigate('steamAuth', { returnTo: 'friends' })}/>
                    </View>
}
 {!this.state.loading && this.state.steamUserPresent && this.state.friends.length == 0 &&
    <View style={this.StyleManager.styles.friendsListNoFriends}>
        <Text>No friends here :(</Text>
    </View>
 }
                    {this.state.steamUserPresent && this.state.friends.length > 0 && <ScrollView
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : {}}>

                        {this
                            .state
                            .friendsOnline
                            .getRowCount() > 0 && <View>
                                <Text style={this.StyleManager.styles.friendsListSectionTitle}>{this.LocaleManager.strings.online}</Text>
                                {this.renderFriendsList(this.state.friendsOnline)}
                            </View>
}

                        {this
                            .state
                            .friendsOffline
                            .getRowCount() > 0 && <View>
                                <Text style={this.StyleManager.styles.friendsListSectionTitle}>{this.LocaleManager.strings.offline}</Text>
                                {this.renderFriendsList(this.state.friendsOffline)}
                            </View>
}
                    </ScrollView>
}

                </ScrollView>
                <BottomNavigation navigation={this.props.navigation} active="friends" />
            </Container>
        )
    }
}

module.exports = FriendsListScreen;
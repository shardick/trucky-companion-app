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
            loading: true,
            api: new TruckyServices()
        };
    }

    async fetchData()
    {
        this.setState({loading: true});

        var settings = await this
            .AppSettings
            .getSettings();

        var friends = await this
            .state
            .api
            .getFriends(settings.steamUser.steamID);

        var tmpFriendsOnline = friends.filter(function (f) {
            return (f.truckersMPUser) && f.onlineStatus && f.onlineStatus.online;
        });

        var tmpFriendsOffline = friends.filter(function (f) {
            return (f.truckersMPUser) && f.onlineStatus && !f.onlineStatus.online;
        });

        this.setState({
            friendsOnline: this
                .state
                .friendsOnline
                .cloneWithRows(tmpFriendsOnline),
            friendsOffline: this
                .state
                .friendsOffline
                .cloneWithRows(tmpFriendsOffline)
        });

        this.setState({loading: false});
    }

    viewOnMap(playerData)
    {
        var mapRoute = Object.assign(this.RouteManager.routes.map, {data: playerData.onlineStatus});

        this
            .props
            .navigator
            .push(mapRoute);
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.pop()}
            centerElement="Friends list"
            rightElement="refresh"
            onRightElementPress={() => this.fetchData().done()}
            />);
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    renderFriendsList(list)
    {
        return (
            <ListView
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
        switch (status)
        {
            case 0:
                return 'Offline';
            case 1:
                return 'Online on Steam';
            case 2:
                return 'Busy on Steam';
            case 3:
                return 'Away on Steam';
            case 4:
                return 'Snoozing on Steam';
            case 5:
                return 'Looking for a trade on Steam';
            case 6:
                return 'Looking for play on Steam';
        }
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
                            <Text style={this.StyleManager.styles.playerOnline}>Online</Text>   
                            <View style={this.StyleManager.styles.meetupsRowButtonContainer}>
                            <Button
                                primary
                                icon="map"
                                text="View on map"
                                onPress={() => this.viewOnMap(rowData)}/>
                            </View>                         
                        </View>
                        }
                        {!rowData.onlineStatus.online && <Text style={this.StyleManager.styles.offline}>Offline</Text>}
                        {rowData.steamUser.personastate > 0 &&
                                <Text>{this.renderPersonaState(rowData.steamUser.personastate)}</Text>
                        }
                    </View>                    
                </View>
            </Card>
        )
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <ScrollView style={this.StyleManager.styles.friendsListMainContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    <ScrollView
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : {}}>

                        {this.state.friendsOnline.getRowCount() > 0 && <View>
                            <Text style={this.StyleManager.styles.friendsListSectionTitle}>Online</Text>
                            {this.renderFriendsList(this.state.friendsOnline)}
                        </View>
}

                        {this.state.friendsOffline.getRowCount() > 0 && <View>
                            <Text style={this.StyleManager.styles.friendsListSectionTitle}>Offline</Text>
                            {this.renderFriendsList(this.state.friendsOffline)}
                        </View>
}
                    </ScrollView>
                </ScrollView>
            </Container>
        )
    }
}

module.exports = FriendsListScreen;
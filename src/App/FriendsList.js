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

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
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

        var tmpFriends = friends.filter(function (f) {
            return (f.truckersMPUser);
        });

        this.setState({
            dataSource: this
                .state
                .dataSource
                .cloneWithRows(tmpFriends)
        });

        this.setState({loading: false});
    }

    viewOnMap(playerData)
    {
        var mapRoute = Object.assign(this.RouteManager.routes.map, { data: playerData.onlineStatus});

        this.props.navigator.push(mapRoute);
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
            centerElement="Friends list"/>);
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    renderRow(rowData) {
        return (
            <Card>
                <View
                    style={{
                    padding: 10,
                    flexDirection: 'row'
                }}>
                    <View>
                        <Image
                            source={{
                            uri: rowData.truckersMPUser.avatar
                        }}
                            style={{
                            width: 50,
                            height: 50,
                            marginRight: 10
                        }}/>
                    </View>
                    <View
                        style={{
                        flexDirection: 'column'
                    }}>
                        <Text>{rowData.truckersMPUser.name}
                            &nbsp;({rowData.truckersMPUser.id})</Text>
                        {rowData.onlineStatus.online && 
                            <View>
                                <Text style={this.StyleManager.styles.playerOnline}>Online</Text>                            
                                <Button primary icon="map" text="View on map" onPress={() => this.viewOnMap(rowData)} />
                            </View>
                        }
                        {!rowData.onlineStatus.online && <Text style={this.StyleManager.styles.offline}>Offline</Text>}
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
                <ScrollView style={this.StyleManager.styles.newsListMainContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    <ScrollView
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : {}}>
                        <ListView
                            style={this.StyleManager.styles.newsListList}
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
                    </ScrollView>
                </ScrollView>
            </Container>
        )
    }
}

module.exports = FriendsListScreen;
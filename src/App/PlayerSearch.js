import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    Alert,
    Picker,
    ScrollView,
    TextInput,
    Keyboard,
    Image,
    ListView
} = ReactNative;

var moment = require('moment');

import Container from '../Container';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Toolbar, Button} from 'react-native-material-ui';
import RNRestart from 'react-native-restart';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import AdaptativeModalPicker from '../Components/AdapativePicker';

/**
 * 
 * 
 * @class PlayerSearchScreen
 * @extends {BaseTruckyComponent}
 */
class PlayerSearchScreen extends BaseTruckyComponent
{
    /**
     * Creates an instance of PlayerSearchScreen.
     * 
     * @memberOf PlayerSearchScreen
     */
    constructor()
    {
        super();

        this.state = {
            searchText: '',
            searchType: 'steamusername',
            loading: false,
            playerInfo: {},
            playerLoaded: false,
            checkingOnlineState: true,
            bans:  new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })
        };
    }

    /**
     * 
     * 
     * 
     * @memberOf PlayerSearchScreen
     */
    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.pop()}
            centerElement={this.LocaleManager.strings.searchPlayer}/>);
    }

    /**
     * 
     * 
     * 
     * @memberOf PlayerSearchScreen
     */
    search()
    {
        this.setState({playerLoaded: false, checkingOnlineState: true});

        //console.warn('search');

        Keyboard.dismiss();

        var instance = this;

        if (this.state.searchText != '') {
            this.setState({loading: true});
            var api = new TruckyServices();
            api
                .searchPlayer(this.state.searchText, this.state.searchType)
                .then((response) => {

                    console.warn(JSON.stringify(response));

                    if (!response.found) {
                        Alert.alert('Player not found');
                        this.setState({playerLoaded: false});                       
                        
                    } else {
                        this.setState({playerInfo: response});
                        this.setState({playerLoaded: true});

                        api.isOnline(response.truckersMPProfileInfo.id)
                            .then( (onlineStatus) => {
                                
                                console.warn(JSON.stringify(onlineStatus));
                                
                                instance.state.playerInfo.onlineStatus = onlineStatus;

                                instance.setState({ playerInfo: instance.state.playerInfo, checkingOnlineState: false });
                            });
                    }

                    this.setState({loading: false});
                });
        }
    }

    /**
     * 
     * 
     * @param {any} row 
     * @returns 
     * 
     * @memberOf PlayerSearchScreen
     */
    renderRow(row)
    {
        return(
            <View style={this.StyleManager.styles.playerSearchBanRow}> 
                <Text>{row.reason}</Text>
                <Text>{this.LocaleManager.strings.expires} {row.expiration}</Text>
                <Text>{this.LocaleManager.strings.formatString(this.LocaleManager.strings.issuedBy, row.adminName, row.timeAdded)}</Text>
            </View>
        );
    }

    viewOnMap()
    {
        var mapRoute = Object.assign(this.RouteManager.routes.map, { data: this.state.playerInfo.onlineStatus});

        this.props.navigator.push(mapRoute);
    }

    renderSearchResult()
    {
        return (
             <ScrollView
                    
                        style={!this.state.playerLoaded
                        ? this.StyleManager.styles.hidden
                        : this.StyleManager.styles.playerSearchResultContainer}>
                        <View style={this.StyleManager.styles.playerSearchResultTitleContainer}>
                            <Text style={this.StyleManager.styles.playerSearchResultTitle}>{this.LocaleManager.strings.truckersMPProfile}</Text>
                        </View>
                        <View style={this.StyleManager.styles.playerSearchResultTitleContainer}>
                            {this.state.playerInfo.steamProfileInfo && this.state.playerInfo.steamProfileInfo.loccountrycode &&
                            <Image
                                style={this.StyleManager.styles.playerSearchResultCountryFlag}
                                source={{
                                uri: this.state.playerInfo.truckersMPProfileInfo
                                    ? "https://flags.fmcdn.net/data/flags/h160/" + this.state.playerInfo.steamProfileInfo.loccountrycode.toLowerCase() + ".png"
                                    : '#'
                            }}/>
                            }
                            {this.state.playerInfo.onlineStatus && !this.state.checkingOnlineState &&
                            <View style={this.StyleManager.styles.playerOnlineStatusContainer}>
                                {this.state.playerInfo.onlineStatus.online && 
                                    <View style={{ alignItems: 'center'}}>
                                        <Text style={this.StyleManager.styles.playerOnline}>{this.LocaleManager.strings.online}</Text>
                                        <Button primary icon="place" text={this.LocaleManager.strings.viewOnMap} onPress={this.viewOnMap.bind(this)} />
                                    </View>
                                }
                                {!this.state.playerInfo.onlineStatus.online && 
                                    <Text style={this.StyleManager.styles.playerOffline}>{this.LocaleManager.strings.offline}</Text>
                                }
                            </View>
                            }
                            {this.state.checkingOnlineState &&
                                <View style={this.StyleManager.styles.playerOnlineStatusContainer}>
                                    <Text>{this.LocaleManager.strings.checkingOnlineState}</Text>
                                </View>
                            }
                            <Image
                                style={this.StyleManager.styles.playerSearchResultImage}
                                source={{
                                uri: this.state.playerInfo.truckersMPProfileInfo
                                    ? this.state.playerInfo.truckersMPProfileInfo.avatar
                                    : '#'
                            }}/>
                        </View>
                        <Text>{this.LocaleManager.strings.nickName} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.truckersMPProfileInfo.name
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.truckersMPID} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.truckersMPProfileInfo.id
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.onTruckersMPfrom} {this.state.playerInfo.truckersMPProfileInfo
                                ? moment(this.state.playerInfo.truckersMPProfileInfo.joinDate, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.role} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.truckersMPProfileInfo.groupName
                                : ''}</Text>
                        <View style={this.StyleManager.styles.playerSearchResultButtonContainer}>
                            <Button icon="open-in-new" primary raised text={this.LocaleManager.strings.viewTruckersMPProfile} onPress={() => this.navigateUrl('https://truckersmp.com/user/' + this.state.playerInfo.truckersMPProfileInfo.id)} />
                        </View>
                        <View style={this.StyleManager.styles.playerSearchResultTitleContainer}>
                            <Text style={this.StyleManager.styles.playerSearchResultTitle}>{this.LocaleManager.strings.steamProfile}</Text>
                        </View>
                        <View style={this.StyleManager.styles.playerSearchResultTitleContainer}>
                            <Image
                                style={this.StyleManager.styles.playerSearchResultImage}
                                source={{
                                uri: this.state.playerInfo.truckersMPProfileInfo
                                    ? this.state.playerInfo.steamProfileInfo.avatarfull
                                    : '#'
                            }}/>
                        </View>
                        <Text>{this.LocaleManager.strings.realName} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.steamProfileInfo.realname
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.steamUsername} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.steamProfileInfo.personaname
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.steamID} {this.state.playerInfo.truckersMPProfileInfo
                                ? this.state.playerInfo.steamProfileInfo.steamid
                                : ''}</Text>
                        <Text>{this.LocaleManager.strings.onSteamFrom} {this.state.playerInfo.truckersMPProfileInfo
                                ? moment.unix(this.state.playerInfo.steamProfileInfo.timecreated).format('DD/MM/YYYY')
                                : ''}</Text>
                        <View style={this.StyleManager.styles.playerSearchResultButtonContainer}>
                            <Button icon="open-in-new" primary raised text={this.LocaleManager.strings.viewSteamProfile} onPress={() => this.navigateUrl(this.state.playerInfo.steamProfileInfo.profileurl)} />
                        </View>
                         <View style={this.StyleManager.styles.playerSearchResultTitleContainer}>
                            <Text style={this.StyleManager.styles.playerSearchResultTitle}>{this.LocaleManager.strings.bans}</Text>
                        </View>
                        {this.state.playerInfo.truckersMPProfileInfo && this.state.playerInfo.bans.length == 0 && <Text>{this.LocaleManager.strings.noBans}</Text>}     
                        {this.state.playerInfo.truckersMPProfileInfo && this.state.playerInfo.bans.length > 0 &&
                                <ListView
                                style={this.StyleManager.styles.newsListList}
                                dataSource={this.state.bans.cloneWithRows(this.state.playerInfo.bans)}
                                renderRow={this.renderRow.bind(this)}
                                automaticallyAdjustContentInsets={false}
                                />                                       
                        }
                    </ScrollView>
        );
    }

    /**
     * 
     * 
     * @returns 
     * 
     * @memberOf PlayerSearchScreen
     */
    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                <View style={this.StyleManager.styles.searchPlayerContainer}>
                    <TextInput
                        style={this.StyleManager.styles.searchPlayerTextInput}
                        onChangeText={(text) => this.setState({searchText: text})}                        
                        placeholder={this.LocaleManager.strings.searchFieldPlaceholder}/>
                   {/* <Picker
                        itemStyle={this.StyleManager.styles.appSettingsPicker}
                        selectedValue={this.state.searchType}
                        onValueChange={(value) => this.setState({searchType: value})}>
                        <Picker.Item
                            label={this.LocaleManager.strings.searchBySteamUsername}
                            value="steamusername"/>
                        <Picker.Item
                            label={this.LocaleManager.strings.searchBySteamID}
                            value="steamid"/>
                        <Picker.Item
                            label={this.LocaleManager.strings.searchByTruckersMPID}
                            value="truckersmpid"/>
                    </Picker>*/}
                    <View style={this.StyleManager.styles.playerSearchPicker}>
                     <View style={this.StyleManager.styles.pickerContainer}>
                    <AdaptativeModalPicker
                                selectedValue={this.state.searchType}
                                data={[
                                {
                                    label: this.LocaleManager.strings.searchBySteamUsername,
                                    key: "steamusername"
                                }, {
                                    label: this.LocaleManager.strings.searchBySteamID,
                                    key: "steamid"
                                }, {
                                    label: this.LocaleManager.strings.searchByTruckersMPID,
                                    key: "truckersmpid"
                                }
                            ]}
                                onChange={(option) => {
                                this.setState({searchType: option.key})
                            }}/>
                        </View>
                        </View>
                    <Button
                        text={this.LocaleManager.strings.searchButton}
                        primary
                        raised
                        onPress={() => this.search()} icon="search"/>
                        {this.state.loading && <ActivityIndicator/>}
                        
                        {this.renderSearchResult()}
                </View>
            </Container>
        );
    }
}

module.exports = PlayerSearchScreen;
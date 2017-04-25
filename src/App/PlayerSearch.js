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
import TruckersMPAPI from '../Services/TruckersMPAPI';
import ActivityIndicator from '../Components/CustomActivityIndicator';

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
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.props.navigator.pop()}
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
        this.setState({playerLoaded: false});

        //console.warn('search');

        Keyboard.dismiss();

        if (this.state.searchText != '') {
            this.setState({loading: true});
            var api = new TruckersMPAPI();
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
                <ScrollView style={this.StyleManager.styles.searchPlayerContainer}>
                    <TextInput
                        onChangeText={(text) => this.setState({searchText: text})}                        
                        placeholder={this.LocaleManager.strings.searchFieldPlaceholder}/>
                    <Picker
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
                    </Picker>
                    <Button
                        text={this.LocaleManager.strings.searchButton}
                        primary
                        raised
                        onPress={() => this.search()} icon="search"/>
                        {this.state.loading && <ActivityIndicator/>}
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
                </ScrollView>
            </Container>
        );
    }
}

module.exports = PlayerSearchScreen;
import React, {Component} from 'react';
import Container from '../Container';

var ReactNative = require('react-native');
var {
    Text,
    View,
    StyleSheet,
    Image
} = ReactNative;

import {ActionButton, Button} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import FeedsService from '../Services/FeedsService';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckersMPApi from '../Services/TruckersMPAPI';

class GameStatus extends BaseTruckyComponent
{
    constructor()
    {
        super();

        this.state = {
            gameVersion: {},
            loading: true,
            api: new TruckersMPApi(),
            refreshTimer: null,
            updateInfo: {}
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this
            .setTimers()
            .done();
    }

    componentWillUnmount() {

        super.componentWillUnmount();

        clearInterval(this.state.refreshTimer);
    }

    async fetchData()
    {
        this.setState({loading: true});

        var gameVersion = await this
            .state
            .api
            .get_version();

        var servers = await this
            .state
            .api
            .servers();

        var playersOnline = 0;

        for (var i = 0; i < servers.length; i++) {
            playersOnline += servers[i].players;
        }

        await this.setGameTime();

        this.setState({totalPlayers: playersOnline, gameVersion: gameVersion});

        var updateInfo = await this
            .state
            .api
            .getUpdateInfo();

        this.setState({updateInfo: updateInfo});

        this.setState({loading: false});
    }

    async setGameTime()
    {
        var gametime = await this
            .state
            .api
            .game_time_formatted();

        this.setState({gameTime: gametime});
    }

    async setTimers()
    {
        this.settings = await this
            .AppSettings
            .getSettings();

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
    
    render()
    {
         return (
            <Container>
                {this.state.loading && <ActivityIndicator/>}
                {(!this.state.loading) && <View style={this.StyleManager.styles.gameVersionContainer}>
                    <Image
                        source={require('../Assets/avatar.png')}
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : this.StyleManager.styles.gameVersionMainImage}/>
                    <Text style={this.StyleManager.styles.gameVersionNews}>{this.state.updateInfo.NewsTitle}</Text>
                    <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.currentGameVersion} {this.state.gameVersion.name}</Text>
                    <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedETSVersion} {this.state.gameVersion.supported_game_version}</Text>
                    <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedATSVersion} {this.state.gameVersion.supported_ats_game_version}</Text>
                    <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.lastReleaseDate} {this.state.gameVersion.time}</Text>
                    <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.state.totalPlayers} {this.LocaleManager.strings.playersOnline}</Text>
                    <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.LocaleManager.strings.currentGameTime} {this.state.gameTime}</Text>
                </View>
                }
            </Container>
        );
    }
}

module.exports = GameStatus;
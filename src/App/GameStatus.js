import React, {Component} from 'react';
import Container from '../Container';

var ReactNative = require('react-native');
var {Text, View, StyleSheet, Image, TouchableHighlight} = ReactNative;

import {ActionButton, Button} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';

class GameStatus extends BaseTruckyComponent
{
    constructor()
    {
        super();

        this.state = {
            gameVersion: null,
            loading: true,
            refreshTimer: null,
            updateInfo: null
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

        var instance = this;

        var api = new TruckyServices();

        //var gameVersion = await api.game_version();
        api.game_version().then( (gameVersion) => {

            instance.setState({ gameVersion: gameVersion});
        });

        //var servers = await api.servers();
        api.servers().then( (servers) => {

            instance.setState( { totalPlayers: servers.totalPlayers});
        });

        //this.setState({totalPlayers: servers.totalPlayers, gameVersion: gameVersion});

        //var updateInfo = await api.update_info();

        api.update_info().then( (updateInfo) => {
            instance.setState({updateInfo: updateInfo});
        });

        //this.setState({updateInfo: updateInfo});

        await this.setGameTime();

        this.setState({loading: false});   
    }

    async setGameTime()
    {
        var api = new TruckyServices();

        var gametime = await api.game_time();

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
                        {!this.state.loading && this.state.updateInfo &&
                         <View style={this.StyleManager.styles.gameVersionContainer}>
                            <Text style={this.StyleManager.styles.gameVersionNews}>{this.state.updateInfo.NewsTitle}</Text>
                            <Button primary text={this.state.updateInfo.NewsLinkDesc} onPress={ () => this.navigateUrl(this.state.updateInfo.NewsLinkUrl)} />
                        </View>
                        }   
                    {!this.state.loading && this.state.gameVersion &&      
                    <View style={this.StyleManager.styles.gameVersionContainer}>           
                        <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.currentGameVersion} {this.state.gameVersion.name}</Text>
                        <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedETSVersion} {this.state.gameVersion.supported_game_version}</Text>
                        <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedATSVersion} {this.state.gameVersion.supported_ats_game_version}</Text>
                        <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.lastReleaseDate} {this.state.gameVersion.time}</Text>
                        <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.state.totalPlayers} {this.LocaleManager.strings.playersOnline}</Text>
                         <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.LocaleManager.strings.currentGameTime}{this.LocaleManager.moment(this.state.gameTime.calculated_game_time).format('dddd HH:mm')}</Text>
                    </View>
                    }
                    
            </Container>
        );
    }
}

module.exports = GameStatus;
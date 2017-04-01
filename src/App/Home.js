import React, {Component, PropTypes} from 'react';
import {
    ToastAndroid,
    ScrollView,
    Platform,
    Animated,
    Easing,
    View,
    StyleSheet,
    Text,
    AppState,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';

import TruckersMPApi from '../Services/TruckersMPAPI';
import Container from '../Container';
import AppDrawerLayout from '../Components/AppDrawerLayout';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import Drawer from 'react-native-drawer'

import BaseTruckyComponent from '../Components/BaseTruckyComponent';

// components
import {
    ActionButton,
    Avatar,
    ListItem,
    Toolbar,
    BottomNavigation,
    Icon,
    Button
} from 'react-native-material-ui';

class Home extends BaseTruckyComponent {
    constructor() {
        super();

        this.state = {
            selected: [],
            searchText: '',
            toolbarHidden: false,
            active: 'people',
            gameVersion: {},
            loading: true,
            api: new TruckersMPApi(),
            refreshTimer: null,
            drawerOpen: false,
            sideMenuIsOpen: false
        };
    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="menu"
            onLeftElementPress={() => this.setState({sideMenuIsOpen: true})}
            centerElement={this.LocaleManager.strings.routeHomeTitle}/>);
    }

    componentDidMount()
    {
        super.componentDidMount();

        this
            .setTimers()
            .done();
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

    render() {
        return (
            <Container>
                <Drawer
                    style={this.StyleManager.styles.sideMenu}
                    open={this.state.sideMenuIsOpen}
                    content={< AppDrawerLayout navigator = {
                    this.props.navigator
                } />}
                    onClose={() => this.setState({sideMenuIsOpen: false})}
                    onOpen={() => this.setState({sideMenuIsOpen: true})}
                    acceptTap={true}
                    tapToClose={true}
                    elevation={10}
                    type="overlay"
                    openDrawerOffset={0.2}
                    tweenHandler={ratio => ({
                    main: {
                        opacity: 1
                    },
                    mainOverlay: {
                        opacity: ratio / 2,
                        backgroundColor: 'black'
                    }
                })}>
                    {this.renderToolbar()}
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="interactive">

                        {this.state.loading && <ActivityIndicator/>}
                        {(!this.state.loading) && <View style={this.StyleManager.styles.gameVersionContainer}>
                            <Image
                                source={require('../Assets/avatar.png')}
                                style={this.state.loading
                                ? this.StyleManager.styles.hidden
                                : this.StyleManager.styles.gameVersionMainImage}/>
                            <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.currentGameVersion} {this.state.gameVersion.name}</Text>
                            <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedETSVersion} {this.state.gameVersion.supported_game_version}</Text>
                            <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.supportedATSVersion} {this.state.gameVersion.supported_ats_game_version}</Text>
                            <Text style={this.StyleManager.styles.gameVersionRow}>{this.LocaleManager.strings.lastReleaseDate} {this.state.gameVersion.time}</Text>
                            <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.state.totalPlayers} {this.LocaleManager.strings.playersOnline}</Text>
                            <Text style={this.StyleManager.styles.gameVersionTotalPlayer}>{this.LocaleManager.strings.currentGameTime} {this.state.gameTime}</Text>
                            <View style={this.StyleManager.styles.marginTop20}>
                                <Button
                                    raised
                                    text='Servers Status'
                                    onPress={() => this.RouteManager.push(this.RouteManager.routes.servers)}/>

                                <TouchableOpacity onPress={() => { this.navigateUrl('https://truckersmp.com') }}>
                                    <Text style={this.StyleManager.styles.marginTop20}>Visit TruckersMP Website</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
}
                    </ScrollView>
                </Drawer>
            </Container>

        );
    }
}

module.exports = Home;

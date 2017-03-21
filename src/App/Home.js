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

import RouteManager from '../routes';
import AppSettings from '../AppSettings';
import TruckersMPApi from '../Services/TruckersMPAPI';
import Container from '../Container';
import styles from '../Styles';
var AppBottomNavigation = require('../Components/BottomNavigation');
import AppDrawerLayout from '../Components/AppDrawerLayout';
const SideMenu = require('react-native-side-menu');
import ActivityIndicator from '../Components/CustomActivityIndicator';

import Drawer from 'react-native-drawer'

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

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

const material = (ratio) => {
    var drawerShadow = ratio < .2
        ? ratio * 5 * 5
        : 5
    return {
        drawer: {
            shadowRadius: drawerShadow
        },
        main: {
            opacity: (2 - ratio) / 2
        }
    }
}
class Home extends Component {
    constructor(props) {
        super(props);

        this.offset = 0;
        this.scrollDirection = 0;

        this.state = {
            selected: [],
            searchText: '',
            toolbarHidden: false,
            active: 'people',
            moveAnimated: new Animated.Value(0),
            gameVersion: {},
            loading: true,
            api: new TruckersMPApi(),
            refreshTimer: null,
            drawerOpen: false,
            sideMenuIsOpen: false
        };
    }

    toggleDrawer()
    {
        /*this.state.drawerOpen
            ? this.setState({drawerOpen: false})
            : this.setState({drawerOpen: true})*/

        this.state.sideMenuIsOpen
            ? this.setState({sideMenuIsOpen: false})
            : this.setState({sideMenuIsOpen: true})

    }

    renderToolbar = () => {
        return (<Toolbar
            leftElement="menu"
            onLeftElementPress={() => this.toggleDrawer()}
            centerElement={this.props.route.title}/>);
    }

    componentDidMount()
    {
        AppState.addEventListener('change', this._handleAppStateChange);

        this
            .fetchData()
            .done();

        var instance = this;

        this
            .setTimers()
            .done();
    }

    async setTimers()
    {
        this.settings = await AppSettings.getSettings();

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
        AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.state.refreshTimer);
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            this
                .fetchData()
                .done();
        }
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

    navigateToServersScreen() {

        this
            .props
            .navigator
            .push(routes.servers);
    }

    openTruckersMPWebSite = () => {
        Linking
            .canOpenURL('https://truckersmp.com')
            .then(supported => {
                if (supported) {
                    Linking.openURL('https://truckersmp.com');
                } else {
                    console.log('Don\'t know how to open URI: https://truckersmp.com');
                }
            });
    };

    renderDrawer()
    {
        return (<AppDrawerLayout navigator={this.props.navigator}/>);
    }

    renderContentView() {
        return (
            <Container>
                <Drawer
                    style={styles.sideMenu}
                    open={this.state.sideMenuIsOpen}
                    content={this.renderDrawer()}
                    onClose={() => this.setState({sideMenuIsOpen: false})}
                    onOpen={() => this.setState({sideMenuIsOpen: true})}
                    acceptTap={true}
                    tapToClose={true}
                    elevation={10}
                    type="overlay"
                    openDrawerOffset={0.2}>
                    {this.renderToolbar()}
                    <ScrollView
                        style={{
                        backgroundColor: '#FAFAFA'
                    }}
                        keyboardShouldPersistTaps="always"
                        keyboardDismissMode="interactive">

                        {this.state.loading && <ActivityIndicator/>}
                        {(!this.state.loading) && <View style={styles.gameVersionContainer}>
                            <Image
                                source={require('../Assets/avatar.png')}
                                style={this.state.loading
                                ? styles.hidden
                                : styles.gameVersionMainImage}/>
                            <Text style={styles.gameVersionRow}>Current version: {this.state.gameVersion.name}</Text>
                            <Text style={styles.gameVersionRow}>Supported ETS game version: {this.state.gameVersion.supported_game_version}</Text>
                            <Text style={styles.gameVersionRow}>Supported ATS game version: {this.state.gameVersion.supported_ats_game_version}</Text>
                            <Text style={styles.gameVersionRow}>Last Release date: {this.state.gameVersion.time}</Text>
                            <Text style={styles.gameVersionTotalPlayer}>{this.state.totalPlayers}&nbsp; players online</Text>
                            <Text style={styles.gameVersionTotalPlayer}>Current game time: {this.state.gameTime}</Text>
                            <View style={styles.marginTop20}>
                                <Button
                                    raised
                                    text='Servers Status'
                                    onPress={() => this.props.navigator.push(RouteManager.routes.servers)}/>

                                <TouchableOpacity onPress={this.openTruckersMPWebSite}>
                                    <Text style={styles.marginTop20}>Visit TruckersMP Website</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
}

                    </ScrollView>
                </Drawer>
            </Container>

        );
    }

    render() {
        return this.renderContentView();

    }
}

Home.propTypes = propTypes;

module.exports = Home;

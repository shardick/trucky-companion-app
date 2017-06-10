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

import Container from '../Container';
import AppDrawerLayout from '../Components/AppDrawerLayout';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import Drawer from 'react-native-drawer'
var DeviceInfo = require('react-native-device-info');

import BaseTruckyComponent from '../Components/BaseTruckyComponent';

// components
import {
    ActionButton,
    Avatar,
    ListItem,
    Toolbar,
    Icon,
    Button
} from 'react-native-material-ui';

import {TabViewAnimated, TabBar} from 'react-native-tab-view';

import NewsFeedScreen from './NewsFeed';
import GameStatusScreen from './GameStatus';

/**
 * First Screen
 *
 * @class Home
 * @extends {BaseTruckyComponent}
 */
class Home extends BaseTruckyComponent {

    constructor() {
        super();

        this.state = {
            drawerOpen: false,
            tabState: {
                index: 0,
                routes: [
                    {
                        key: '1',
                        title: this.LocaleManager.strings.newsAndEvents
                    }, {
                        key: '2',
                        title: this.LocaleManager.strings.gameStatus
                    }
                ]
            }
        };
    }

    closeDrawer()
    {
        this.setState({sideMenuIsOpen: true});
    }
    /**
     * Material UI toolbar rendering
     *
     *
     * @memberOf Home
     */
    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement={DeviceInfo.isTablet() ? '' : 'menu'}
            onLeftElementPress={() => this.closeDrawer()}
            centerElement={this.LocaleManager.strings.routeHomeTitle}/>);
    }

    _handleChangeTab = (index) => {
        this.setState({index});
    };

    _renderHeader = (props) => {
        return <TabBar
            tabStyle={{
            backgroundColor: this.StyleManager.styles.uiTheme.palette.primaryColor
        }}
            {...props}/>;
    };

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                return <NewsFeedScreen navigation={this.RouteManager.navigator}/>;
            case '2':
                return <GameStatusScreen navigation={this.RouteManager.navigator}/>;
            default:
                return null;
        }
    };

    renderTabView()
    {
        return (
                    <TabViewAnimated
                        style={this.StyleManager.styles.simpleFlex}
                        navigationState={this.state.tabState}
                        renderScene={this._renderScene}
                        renderHeader={this._renderHeader}
                        onRequestChangeTab={this._handleChangeTab}/>
        );
    }
    render() {

        var openDrawerOffset = 0.2;

        if (DeviceInfo.isTablet()) 
            openDrawerOffset = 0.7;
        return (
            <Container>
                {DeviceInfo.isTablet() && 
                    this.renderToolbar() &&
                    this.renderTabView()
                }
                {!DeviceInfo.isTablet() && 
                <Drawer
                    ref={(drawer) => this.drawer = drawer}
                    style={this.StyleManager.styles.sideMenu}
                    open={this.state.sideMenuIsOpen}
                    content={< AppDrawerLayout navigation={this.props.navigation} page = {
                    this
                }
                ref = {
                    (appdrawer) => this.appdrawer = appdrawer
                }
                navigation = {
                    this.props.navigation
                } />}
                    onClose={() => this.setState({sideMenuIsOpen: false})}
                    onOpen={() => this.setState({sideMenuIsOpen: true})}
                    acceptTap={true}
                    tapToClose={true}
                    elevation={10}
                    type="overlay"
                    openDrawerOffset={openDrawerOffset}
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
                    {this.renderTabView()}
                </Drawer>  
                }             
            </Container>

        );
    }
}

module.exports = Home;

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

    /**
     * Material UI toolbar rendering
     *
     *
     * @memberOf Home
     */
    renderToolbar = () => {
        return (<Toolbar
            leftElement="menu"
            onLeftElementPress={() => this.setState({sideMenuIsOpen: true})}
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
                return <NewsFeedScreen/>;
            case '2':
                return <GameStatusScreen/>;
            default:
                return null;
        }
    };

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
                    <TabViewAnimated
                        style={this.StyleManager.styles.simpleFlex}
                        navigationState={this.state.tabState}
                        renderScene={this._renderScene}
                        renderHeader={this._renderHeader}
                        onRequestChangeTab={this._handleChangeTab}/>
                </Drawer>
            </Container>

        );
    }
}

module.exports = Home;

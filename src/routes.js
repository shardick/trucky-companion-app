import Home from './App/Home';
import ServersScreen from './App/Servers';
import SettingsScreen from './App/Settings';
import RulesScreen from './App/Rules';
import MeetupsScreen from './App/Meetups';
import AboutScreen from './App/About';
import SplashScreen from './App/SplashScreen';
import NewsFeedScreen from './App/NewsFeed';
import SearchPlayerScreen from './App/PlayerSearch';
import MapScreen from './App/Map';
import SteamAuthScreen from './App/SteamAuth';
import FriendsListScreen from './App/FriendsList';
var DeviceInfo = require('react-native-device-info');

import React, {Component, PropTypes} from 'react';

var ReactNative = require('react-native');
var {
    BackHandler, Platform
} = ReactNative;

class RouteManager
{
    constructor()
    {}

    setNavigator(navigator)
    {
        this._navigator = navigator;
    }

    get navigator()
    {
        return this._navigator;
    }

    navigate(screenName, params, action)
    {
        this._navigator.navigate(screenName, params, action);
    }

    back()
    {
        if (this._navigator.state.title != 'Home')
        {
            this._navigator.goBack();
        }
        else
        {
            if (Platform.OS == 'android')
                BackHandler.exitApp();            
        }
    }

    backToRoute(route)
    {
        this._navigator.goBack(route);
    }

    get routes()
    {
        var initialRoutes = {};

        if (!DeviceInfo.isTablet())
        {
            initialRoutes.splashScreen = {
                title: 'SplashScreen',
                screen: SplashScreen
            }            
        }

        var allRoutes = 
        {
            home: {
                title: 'Home',
                screen: Home
            },
            servers: {
                title: 'Servers',
                screen: ServersScreen
            },
            settings: {
                title: 'Settings',
                screen: SettingsScreen
            },
            rules: {
                title: 'Rules',
                screen: RulesScreen
            },
            meetups: {
                title: 'Meetups',
                screen: MeetupsScreen,
                navigationTab: 'meetups'
            },
            about: {
                title: 'About',
                screen: AboutScreen
            },            
            newsFeed: {
                title: 'News',
                screen: NewsFeedScreen
            },
            searchPlayer: {
                title: 'Search',
                screen: SearchPlayerScreen
            },
            map: {
                title: 'Map',
                screen: MapScreen
            },
            steamAuth: {
                title: 'SteamAuthentication',
                screen: SteamAuthScreen
            },
            friends: {
                title: 'Friends',
                screen: FriendsListScreen
            },
            splashScreen: {
                screen: SplashScreen
            }
        };

        return Object.assign(initialRoutes, allRoutes);
    }
}

export default RouteManager;

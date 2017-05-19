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
import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    BackAndroid, Platform
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

    push(route)
    {
        this
            ._navigator
            .push(route);
    }

    pop()
    {
        const routes = this
            ._navigator
            .getCurrentRoutes();

        if (routes.length > 2) {
            route = routes[routes.length - 2];

            //console.warn(route.reference.constructor.name);

            if (typeof(route.reference) != 'undefined')
            {
                route
                    .reference
                    .onPop();
            }
        }
        else
            route = routes[0];

        if (route.title != "SplashScreen") {
            this
                ._navigator
                .pop();
        }
        else
        {
            if (Platform.OS == 'android')
                BackAndroid.exitApp();
        }
    }

    get routes()
    {
        return ({
            home: {
                title: 'Home',
                Page: Home
            },
            servers: {
                title: 'Servers',
                Page: ServersScreen
            },
            settings: {
                title: 'Settings',
                Page: SettingsScreen
            },
            rules: {
                title: 'Rules',
                Page: RulesScreen
            },
            meetups: {
                title: 'Meetups',
                Page: MeetupsScreen,
                navigationTab: 'meetups'
            },
            about: {
                title: 'About',
                Page: AboutScreen
            },
            splashScreen: {
                title: 'SplashScreen',
                Page: SplashScreen
            },
            newsFeed: {
                title: 'News',
                Page: NewsFeedScreen
            },
            searchPlayer: {
                title: 'Search',
                Page: SearchPlayerScreen
            },
            map: {
                title: 'Map',
                Page: MapScreen
            },
            steamAuth: {
                title: 'SteamAuthentication',
                Page: SteamAuthScreen
            },
            friends: {
                title: 'Friends',
                Page: FriendsListScreen
            }
        });
    }
}

export default RouteManager;

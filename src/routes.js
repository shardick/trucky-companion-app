import Home from './App/Home';
import ServersScreen from './App/Servers';
import SettingsScreen from './App/Settings';
import RulesScreen from './App/Rules';
import MeetupsScreen from './App/Meetups';
import AboutScreen from './App/About';
import SplashScreen from './App/SplashScreen';
import NewsFeedScreen from './App/NewsFeed';
import SearchPlayerScreen from './App/PlayerSearch';

class RouteManager
{
    constructor()
    {}

    setNavigator(navigator)
    {
        this._navigator = navigator;
    }
    push(route)
    {
        this
            ._navigator
            .push(route);
    }

    pop()
    {
        this
            ._navigator
            .pop();
    }

    get routes()
    {
        return ({
            home: {
                title: 'Trucky Companion App',
                Page: Home,
                navigationTab: 'home'
            },
            servers: {
                title: 'TruckersMP Servers',
                Page: ServersScreen,
                navigationTab: 'servers'
            },
            settings: {
                title: 'Settings',
                Page: SettingsScreen
            },
            rules: {
                title: 'TruckersMP Rules',
                Page: RulesScreen
            },
            meetups: {
                title: 'Meetups',
                Page: MeetupsScreen,
                navigationTab: 'meetups'
            },
            about: {
                title: 'About this app',
                Page: AboutScreen
            },
            splashScreen: {
                Page: SplashScreen
            },
            newsFeed: {
                title: 'News Feed',
                Page: NewsFeedScreen
            },
            searchPlayer: {
                title: 'Search Player',
                Page: SearchPlayerScreen
            }
        });
    }
}

export default RouteManager;

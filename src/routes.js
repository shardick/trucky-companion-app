import Home from './App/Home';
import ServersScreen from './App/Servers';
import SettingsScreen from './App/Settings';
import RulesScreen from './App/Rules';
import MeetupsScreen from './App/Meetups';
import AboutScreen from './App/About';
import SplashScreen from './App/SplashScreen';

class RouteManager
{
    static get routes()
    {
        return(
        {
            home : {
                title: 'Trucky Companion App',
                Page: Home,
                navigationTab: 'home'
            },
            servers : {
                title: 'TruckersMP Servers',
                Page: ServersScreen,
                navigationTab: 'servers'
            },
            settings : {
                title: 'Settings',
                Page: SettingsScreen
            },
            rules : {
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
            }
        });
    }
}

export default RouteManager;

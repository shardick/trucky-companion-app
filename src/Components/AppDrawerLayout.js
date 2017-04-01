import React, {Component, PropTypes} from 'react';
import ReactNative from 'react-native';
const {View, Text, Image} = ReactNative;
import RouteManager from '../routes';
import styles from '../Styles';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import LocaleManager from '../Locales/LocaleManager';

var lc = new LocaleManager();

import {Drawer} from 'react-native-material-ui';

class AppDrawerLayout extends Component
{
    constructor()
    {
        super();

        this.state = {
            drawerOpen: false
        };
    }

    componendDidMount()
    {
        this.setState({drawerOpen: this.props.drawerOpen});
    }

    onPress(route)
    {
        this.setState({drawerOpen: false});
        this
            .props
            .navigator
            .push(route);
    }

    render() {
        return (
                <Drawer>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                    <Image source={require('../Assets/trucky_banner.png')} style={{width: 100, height: 100}}/>
                    </View>
                    <Drawer.Section
                        items={[
                        {
                            icon: 'cloud',
                            value: lc.strings.servers,
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.servers)
                        },, {
                            icon: <FAIcon name="calendar" size={22}/>,
                            value: lc.strings.meetups,
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.meetups)
                        }, {
                            icon: 'search',
                            value: lc.strings.searchPlayer,
                        }, {
                            icon: 'list',
                            value: lc.strings.rules,
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.rules)
                        }, {
                            icon: 'settings',
                            value: lc.strings.settings,
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.settings)
                        }, {
                            icon: 'info',
                            value: lc.strings.about,
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.about)
                        }
                    ]}/>
                </Drawer>
        )
    }
}

module.exports = AppDrawerLayout;
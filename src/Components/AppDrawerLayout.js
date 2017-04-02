import React, {Component, PropTypes} from 'react';
import ReactNative from 'react-native';
const {View, Text, Image} = ReactNative;
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {Drawer} from 'react-native-material-ui';

import BaseTruckyComponent from '../Components/BaseTruckyComponent';


/**
 * Component that contains App Drawer interface
 * 
 * @class AppDrawerLayout
 * @extends {BaseTruckyComponent}
 */
class AppDrawerLayout extends BaseTruckyComponent
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

        this.RouteManager.push(route);
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
                            value: this.LocaleManager.strings.servers,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.servers)
                        },, {
                            icon: <FAIcon name="calendar" size={22}/>,
                            value: this.LocaleManager.strings.meetups,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.meetups)
                        }, {
                            icon: 'search',
                            value: this.LocaleManager.strings.searchPlayer,
                        }, {
                            icon: 'list',
                            value: this.LocaleManager.strings.rules,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.rules)
                        }, {
                            icon: 'settings',
                            value: this.LocaleManager.strings.settings,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.settings)
                        }, {
                            icon: 'info',
                            value: this.LocaleManager.strings.about,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.about)
                        }
                    ]}/>
                </Drawer>
        )
    }
}

module.exports = AppDrawerLayout;
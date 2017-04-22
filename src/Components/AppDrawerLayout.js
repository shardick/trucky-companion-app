import React, {Component, PropTypes} from 'react';
import ReactNative from 'react-native';
const {View, Text, Image} = ReactNative;
import FAIcon from 'react-native-vector-icons/FontAwesome';

import {Drawer, Avatar} from 'react-native-material-ui';

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

    visitLink(url)
    {
        this.navigateUrl(url);
    }

    render() {
        return (
                <Drawer>
                    <View style={{alignItems: 'center', marginTop: 10}}>
                        <Image source={require('../Assets/trucky_banner.png')} style={{width: 100, height: 100}}/>
                    </View>
                    <Drawer.Section
                        divider
                        items={[
                        {
                            icon: 'cloud',
                            value: this.LocaleManager.strings.servers,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.servers)
                        }, {
                            icon: <FAIcon name="calendar" size={22}/>,
                            value: this.LocaleManager.strings.meetups,
                            onPress: this
                                .onPress
                                .bind(this, this.RouteManager.routes.meetups)
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
                    <Drawer.Section                        
                        items={[
                        {
                            icon: <FAIcon name="globe" size={22}/>,
                            value: this.LocaleManager.strings.truckersMPWebSite,
                            onPress: this.visitLink.bind(this, 'https://truckersmp.com/')
                        },
                        {
                            icon: <FAIcon name="globe" size={22}/>,
                            value: this.LocaleManager.strings.truckersMPForum,
                            onPress: this.visitLink.bind(this, 'https://forum.truckersmp.com/')
                        },
                        {
                            icon: <FAIcon name="steam" size={22}/>,
                            value: this.LocaleManager.strings.truckersMPSteamGroup,
                            onPress: this.visitLink.bind(this, 'http://steamcommunity.com/groups/truckersmpofficial')
                        }]}
                        >                        
                    </Drawer.Section>
                </Drawer>
        )
    }
}

module.exports = AppDrawerLayout;
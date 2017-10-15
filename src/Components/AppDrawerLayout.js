import React, { Component, PropTypes } from 'react';
import ReactNative from 'react-native';
const { View, Text, Image, ScrollView } = ReactNative;
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Drawer, Avatar } from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import { NavigationActions } from 'react-navigation'
var DeviceInfo = require('react-native-device-info');

/**
 * Component that contains App Drawer interface
 *
 * @class AppDrawerLayout
 * @extends {BaseTruckyComponent}
 */
class AppDrawerLayout extends BaseTruckyComponent {
    constructor() {
        super();

        this.state = {
            drawerOpen: false
        };
    }

    componendDidMount() {
        this.setState({ drawerOpen: this.props.drawerOpen });
    }

    onPress(route) {
        //this.props.page.closeDrawer();

       //this.props.navigator.navigate(route);

       if (!DeviceInfo.isTablet())
       {   
           this.RouteManager.navigate(route);   
       }
       else
       {
           this.props.navigate(route);
       }
    }

    visitLink(url) {
        this.navigateUrl(url);
    }

    getTabletItems()
    {
        return [
            {
                icon: 'cloud',
                value: this.LocaleManager.strings.servers,
                onPress: this
                    .onPress
                    .bind(this, 'servers')
            }, {
                icon: 'event',
                value: this.LocaleManager.strings.meetups,
                onPress: this
                    .onPress
                    .bind(this, 'meetups')
            }, {
                icon: 'map',
                value: this.LocaleManager.strings.liveMapRouteTitle,
                onPress: this
                    .onPress
                    .bind(this, 'map')
            }, {
                icon: 'people',
                value: this.LocaleManager.strings.friends,
                onPress: this
                    .onPress
                    .bind(this, 'friends')
            }
        ];
    }

    getMultiDeviceItems()
    {
        return [

            {
                icon: 'warning',
                value: this.LocaleManager.strings.traffic,
                onPress: this
                    .onPress
                    .bind(this, 'traffic')
            },
            /*{
                icon: 'poll',
                value: this.LocaleManager.strings.telemetry,
                onPress: this
                    .onPress
                    .bind(this, 'telemetry')
            },*/
            {
                icon: 'announcement',
                value: this.LocaleManager.strings.scsSoftNews,
                onPress: this
                    .onPress
                    .bind(this, 'scsSoft')
            },
            {
                icon: <FAIcon name="picture-o" size={22} />,
                value: this.LocaleManager.strings.wotGallery,
                onPress: this
                    .onPress
                    .bind(this, 'wotGallery')
            },
            {
                icon: 'search',
                value: this.LocaleManager.strings.searchPlayer,
                onPress: this
                    .onPress
                    .bind(this, 'searchPlayer')
            }, {
                icon: 'list',
                value: this.LocaleManager.strings.rules,
                onPress: this
                    .onPress
                    .bind(this, 'rules')
            }, {
                icon: 'settings',
                value: this.LocaleManager.strings.settings,
                onPress: this
                    .onPress
                    .bind(this, 'settings')
            }, {
                icon: 'info',
                value: this.LocaleManager.strings.about,
                onPress: this
                    .onPress
                    .bind(this, 'about')
            }

        ];
    }

    getItems()
    {
        if (DeviceInfo.isTablet())
            {
                return this.getTabletItems().concat(this.getMultiDeviceItems());
            }
            else
                return this.getMultiDeviceItems();
    }

    render() {
        return (
            <Drawer>
                <View
                    style={this.StyleManager.styles.appDrawerLogoContainer}>
                    <Image
                        source={require('../Assets/trucky_banner.png')}
                        style={this.StyleManager.styles.appDrawerLogo} />
                </View>
                <Drawer.Section
                    divider
                    items={this.getItems()} />
                <Drawer.Section
                    items={[
                        {
                            icon: <FAIcon name="globe" size={22} />,
                            value: this.LocaleManager.strings.truckersMPWebSite,
                            onPress: this
                                .visitLink
                                .bind(this, 'https://truckersmp.com/')
                        }, {
                            icon: <FAIcon name="globe" size={22} />,
                            value: this.LocaleManager.strings.truckersMPForum,
                            onPress: this
                                .visitLink
                                .bind(this, 'https://forum.truckersmp.com/')
                        }, {
                            icon: <FAIcon name="steam" size={22} />,
                            value: this.LocaleManager.strings.truckersMPSteamGroup,
                            onPress: this
                                .visitLink
                                .bind(this, 'http://steamcommunity.com/groups/truckersmpofficial')
                        }
                    ]}></Drawer.Section>
            </Drawer>
        )
    }
}

module.exports = AppDrawerLayout;
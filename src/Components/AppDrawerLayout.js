import React, {Component, PropTypes} from 'react';
import ReactNative from 'react-native';
const {View, Text, Image} = ReactNative;
import RouteManager from '../routes';
import styles from '../Styles';
import FAIcon from 'react-native-vector-icons/FontAwesome';

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
                            value: 'Servers',
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.servers)
                        },, {
                            icon: <FAIcon name="calendar" size={22}/>,
                            value: 'Meetups',
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.meetups)
                        }, {
                            icon: 'search',
                            value: 'Search Player'
                        }, {
                            icon: 'list',
                            value: 'Rules',
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.rules)
                        }, {
                            icon: 'settings',
                            value: 'Settings',
                            onPress: this
                                .onPress
                                .bind(this, RouteManager.routes.settings)
                        }, {
                            icon: 'info',
                            value: 'About',
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
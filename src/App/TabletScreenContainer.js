import React, {Component} from 'react';
import RM from '../routes';
import {StackNavigator} from 'react-navigation';
import {View, BackHandler} from 'react-native';
import AppDrawerLayout from '../Components/AppDrawerLayout';

const RouteManager = new RM();
const Navigator = StackNavigator(RouteManager.routes, {headerMode: 'none'});

class TabletScreenContainer extends Component
{
    constructor()
    {
        super();
    }

    navigate(route)
    {
        this
            .navigator
            ._navigation
            .navigate(route);
    }

    render()
    {
        return (
            <View style={AppStyles.tabletContainer}>
                <View style={AppStyles.drawerContainer}>
                    <AppDrawerLayout
                        navigate={(route) => this.navigate(route)}
                        ref={(appdrawer) => this.appdrawer = appdrawer}/>
                </View>
                <View style={AppStyles.tabletRouteContainer}>
                    <Navigator
                        ref={(navigator) => this.navigator = navigator}
                        initialRouteName='home'
                        />
                </View>
            </View>
        );
    }
}

var AppStyles = {
    simpleFlex: {
        flex: 1
    },
    tabletContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    drawerContainer: {
        width: 250,
        flex: 1
    },
    tabletRouteContainer: {
        flex: 3
    }
};

module.exports = TabletScreenContainer;
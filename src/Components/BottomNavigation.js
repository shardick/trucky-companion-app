import React, {Component, PropTypes} from 'react';
import RouteManager from '../routes';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import styles from '../Styles';
import {BottomNavigation, Icon} from 'react-native-material-ui';

class AppBottomNavigation extends Component
{
    navigate(route)
    {
        this
            .props
            .navigator
            .push(route);
    }

    render() {
        //console.warn(JSON.stringify(this.props.routes));

        return (
            <BottomNavigation
                style={{
                container: styles.bottomNavigationStyle
            }}
                active={this.props.active}>
                <BottomNavigation.Action
                    key="home"
                    icon="home"
                    label="Status"
                    onPress={() => this.navigate(RouteManager.routes.home)}/>
                <BottomNavigation.Action
                    key="servers"
                    icon="cloud"
                    label="Servers"
                    onPress={() => this.navigate(RouteManager.routes.servers)}/>
                <BottomNavigation.Action
                    icon={< FAIcon name = "truck" size = {
                    24
                } />}
                    key="meetups"
                    label="Meetups"
                    onPress={() => this.navigate(RouteManager.routes.meetups)}/>
            </BottomNavigation>
        );
    }
}

module.exports = AppBottomNavigation;
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
var DeviceInfo = require('react-native-device-info');
import BaseTruckyComponent from './BaseTruckyComponent';
import { BottomNavigation } from 'react-native-material-ui';
 
class AppBottomNavigation extends BaseTruckyComponent {

  tabs()
  {
      return [
          {
              label: this.LocaleManager.strings.home,
              icon: 'home',
              route: 'home'
          },
           {
              label: this.LocaleManager.strings.servers,
              icon: 'cloud',
              route: 'servers'
          },
           {
              label: this.LocaleManager.strings.meetups,
              icon: 'event',
              route: 'meetups'
          },
           {
              label: this.LocaleManager.strings.liveMapRouteTitle,
              icon: 'map',
              route: 'map'
          },  
           {
              label: this.LocaleManager.strings.friends,
              icon: 'people',
              route: 'friends'
          },    
      ];
  }

  render() {
    return (
      !DeviceInfo.isTablet() &&
      <BottomNavigation style={ {container: { position: 'absolute', bottom: 0, left: 0, right: 0, flex: 1 }}} active={this.props.active} hidden={false} >
        {
            this.tabs().map( (tab) => {
                return <BottomNavigation.Action
                    key={tab.route}
                    icon={tab.icon}
                    style={ { container: { paddingRight: 10, paddingLeft: 10, maxWidth: 100, minWidth: 60 }}}
                    /*label={tab.label}*/
                    onPress={() => this.RouteManager.navigate(tab.route)}
                />
            })
        }
      </BottomNavigation>      
    )
  }
}

module.exports = AppBottomNavigation;
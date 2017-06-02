import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    View,    
    WebView,
    Alert
} = ReactNative;
import Container from '../Container';
import {Toolbar} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';

class SteamAuthScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.steamAuthentication}
            />);
    }

    onBridgeMessage(event)
    {
        var instance = this;

        console.warn(event.nativeEvent.data);

        var returnTo = this.RouteManager.navigator.state.params.returnTo;

        //console.warn(returnTo);

        var message = JSON.parse(event.nativeEvent.data);

        switch (message.messageType)
        {
            case 'userAuth':
                this.AppSettings.setValue('steamUser', { steamID: message.user.id, steamDisplayName: message.user.displayName })
                .then(() => {
                    instance.RouteManager.navigate(returnTo);
                });
                break;
        }
    }

    render()
    {
        //console.warn(this.props.route.callback);
        //console.warn(this.props.navigation.state.params.returnTo);
        return(
            <Container>
                {this.renderToolbar()}
                <WebView
                    onMessage={this.onBridgeMessage.bind(this)}
                    startInLoadingState={true}
                    source={{ uri: "https://truckyservices.herokuapp.com/steam/auth" }}
                />
            </Container>
        )
    }
}

module.exports = SteamAuthScreen;
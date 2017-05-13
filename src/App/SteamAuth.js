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
        return (<Toolbar
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.pop()}
            centerElement="Steam authentication"
            />);
    }

    onBridgeMessage(event)
    {
        var instance = this;

        console.warn(event.nativeEvent.data);

        var message = JSON.parse(event.nativeEvent.data);

        switch (message.messageType)
        {
            case 'userAuth':
                this.AppSettings.setValue('steamUser', { steamID: message.user.id, steamDisplayName: message.user.displayName })
                .then(() => {
                    //Alert.alert('Loggedin as ' + message.user.displayName);
                    
                    //console.warn(instance.props.callback);
                    //instance.props.route.callback().done();

                    instance.RouteManager.pop();
                });
                break;
        }
    }

    render()
    {
        //console.warn(this.props.route.callback);
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
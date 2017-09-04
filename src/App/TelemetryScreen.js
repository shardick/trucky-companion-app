import React, {Component, PropTypes} from 'react';
var ReactNative = require('react-native');
var {
    Text,
    View,
    ScrollView,
    StyleSheet,
    ListView,
    WebView
} = ReactNative;
import Container from '../Container';
import {Toolbar, Button, ActionButton} from 'react-native-material-ui';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import TruckyServices from '../Services/TruckyServices';
import BottomNavigation from '../Components/BottomNavigation';
import KeepAwake from 'react-native-keep-awake';

class TelemetryScreen extends BaseTruckyComponent {

    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            loading: true,
            showMap: false
        }
    }

    componentDidMount()
    {
        super.componentDidMount();

        KeepAwake.activate();
    }

    async fetchData()
    {
        var settings = await this.AppSettings.getSettings();

        var ip = 'http://' + settings.telemetryServerIP + ':25555' + '/dashboard-host.html?skin=default&ip=' + settings.telemetryServerIP;

        this.setState({ telemetryServerIP: ip, loading: false, showMap: true });
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            centerElement={this.LocaleManager.strings.telemetry}
            onLeftElementPress={() => this.RouteManager.back()}
            />);
    }

    render() {
        
                return (
                    <Container>                
                        
                        {this.state.loading && <ActivityIndicator/>}
                        <WebView
                            style={this.state.showMap ? { marginBottom: 50 } : this.StyleManager.styles.hidden}
                            ref="webviewbridge"
                            source={{ uri: this.state.telemetryServerIP }}/>
                         <BottomNavigation navigation={this.props.navigation} />
                    </Container>
                )
            }
}

module.exports = TelemetryScreen;
import React, {Component, PropTypes} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProgressBar from 'react-native-progress/Bar';
import Container from '../Container';

var ReactNative = require('react-native');
var {
    ListView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    RefreshControl,
    AppState
} = ReactNative;

import {Toolbar, ActionButton, Card} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';
import BottomNavigation from '../Components/BottomNavigation';
import {TabViewAnimated, TabBar} from 'react-native-tab-view';
import TrafficListView from '../Components/TrafficListView';

class TrafficScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            loading: true,
            tabState: {
                index: 0,
                routes: [
                    { key: '-1', title: 'Europe #2'},
                    { key: '-2', title: 'Europe #1'}
                ],
                loaded: false
            }
        };
        this.settings = {};
    }

    componentDidMount() {

        super.componentDidMount();
    }

    async fetchData() {

        this.setState({loading: true});

        var api = new TruckyServices();

        var traffic_servers = await api.traffic_servers();

        var tabRoutes = [];

        traffic_servers.forEach(function(element) {
            
            tabRoutes.push({
                key: element.parameter,
                title: element.name
            })
        }, this);

        this.setState({ tabState: { index: 0, routes: tabRoutes }});

        var traffic = await api.traffic('eu2');

        if (traffic != null && traffic.length > 0)
        {
            this.setState({traffic_servers: traffic_servers, traffic: traffic });
            
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(traffic)
            });
        }

        this.setState({loading: false});
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.traffic}
            />);
    }

    _handleChangeTab = (index) => {
        this.setState({tabState: { index: index, routes: this.state.tabState.routes } });
    };

    _renderHeader = (props) => {
        return <TabBar
            tabStyle={{
            backgroundColor: this.StyleManager.styles.uiTheme.palette.primaryColor
        }}
            {...props}/>;
    };

    _renderScene = ({route}) => {

        if (route.key != '-1' && route.key != '-2')
                return <TrafficListView server={route.key} navigation={this.RouteManager.navigator}/>;
        else
            return null;
        
    };

    renderTabView()
    {
        return (
                    <TabViewAnimated
                        lazy={true}
                        style={this.StyleManager.styles.simpleFlex}
                        navigationState={this.state.tabState}
                        renderScene={this._renderScene}
                        renderHeader={this._renderHeader}
                        onIndexChange={this._handleChangeTab}/>
        );
    }

    render()
    {
        return (
            <Container>
                {this.renderToolbar()}
                {this.renderTabView()}
                <BottomNavigation navigation={this.props.navigation} active="home" />
            </Container>
        )
    }
}

module.exports = TrafficScreen;
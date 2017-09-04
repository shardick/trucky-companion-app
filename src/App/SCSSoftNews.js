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
import NewsFeedScreen from '../App/NewsFeed';

class SCSSoftNews extends BaseTruckyComponent
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
                    { key: 'ets2', title: 'ETS2'},
                    { key: 'ats', title: 'ATS'}
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

       
    }

    async getATSNews()
    {
        var api = new TruckyServices();
        return await api.atsNews();
    }

    async getETS2News()
    {
        var api = new TruckyServices();
        return await api.ets2News();        
    }

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.scsSoftNews}
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

        switch (route.key)
        {
            case 'ets2':
                return <NewsFeedScreen feedFunction={this.getETS2News} />
                break;
            case 'ats':
                return <NewsFeedScreen feedFunction={this.getATSNews} />
                break;
        }
        
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

module.exports = SCSSoftNews;
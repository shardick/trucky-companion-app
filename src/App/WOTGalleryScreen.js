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
import WOTGallery from '../Components/WOTGallery';

class WOTGalleryScreen extends BaseTruckyComponent
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
                    { key: 'newest', title: this.LocaleManager.strings.wotGalleryNewest},
                    { key: 'bestRated', title: this.LocaleManager.strings.wotGalleryBestRated},
                    { key: 'editorsPick', title: this.LocaleManager.strings.wotGalleryEditorsPick}
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

    renderToolbar = () => {
        return (<Toolbar style={ {container: this.StyleManager.styles.toolBar}}
            leftElement="arrow-back"
            onLeftElementPress={() => this.RouteManager.back()}
            centerElement={this.LocaleManager.strings.wotGallery}
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

        return <WOTGallery galleryType={route.key} />
        
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

module.exports = WOTGalleryScreen;
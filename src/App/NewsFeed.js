import React, {Component} from 'react';
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

import {Toolbar, ActionButton, Card, Button} from 'react-native-material-ui';
import ActivityIndicator from '../Components/CustomActivityIndicator';
import BaseTruckyComponent from '../Components/BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';

class NewsFeedScreen extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            loading: true
        };
    }

    async fetchData()
    {
        this.setState({loading: true});

        //var api = new TruckyServices();

        //var feed = await api.news();

        var feed = await this.props.feedFunction();

        if (feed != null) {
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(feed)
            });            
        }

        this.setState({loading: false});
    }

    renderRow(rowData) {
        return (
            <Card>
                <View style={this.StyleManager.styles.newsRowContainer}>
                    <Text style={this.StyleManager.styles.newsRowTitle}>{rowData.title}</Text>
                    <Text style={this.StyleManager.styles.newsDate}>{this
                            .LocaleManager
                            .moment(rowData.newsDate)
                            .format('ddd, DD/MM/YYYY HH:mm')}</Text>
                    <Text style={this.StyleManager.styles.newsText}>{rowData
                            .description
                            .replace(/(<([^>]+)>)/ig, "")
                            .substring(0, 200)}
                        ...</Text>
                    <View style={this.StyleManager.styles.newsRowButtonContainer}>
                        <Button
                            primary
                            text={this.LocaleManager.strings.readMore}
                            onPress={() => this.navigateUrl(rowData.link)}/>
                    </View>
                </View>
            </Card>
        )
    }

    _onRefresh() {
        this
            .fetchData()
            .done();
    }

    render()
    {
        return (
            <Container>

                <View style={this.StyleManager.styles.newsListMainContainer}>
                    {this.state.loading && <ActivityIndicator/>}
                    <View
                        style={this.state.loading
                        ? this.StyleManager.styles.hidden
                        : {}}>
                        <ListView
                            style={this.StyleManager.styles.newsListList}
                            dataSource={this.state.dataSource}
                            renderRow={this
                            .renderRow
                            .bind(this)}
                            automaticallyAdjustContentInsets={false}
                            renderSeparator={(sectionId, rowId) => <View key={rowId} style={this.StyleManager.styles.separator}/>}
                            refreshControl={< RefreshControl refreshing = {
                            this.state.loading
                        }
                        onRefresh = {
                            this
                                ._onRefresh
                                .bind(this)
                        } />}/>
                    </View>
                </View>
            </Container>
        );
    }
}

module.exports = NewsFeedScreen;
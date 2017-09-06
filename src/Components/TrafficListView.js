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
    AppState,
    TouchableOpacity
} = ReactNative;

import {Toolbar, ActionButton, Card, Button} from 'react-native-material-ui';
import ActivityIndicator from './CustomActivityIndicator';
import BaseTruckyComponent from './BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';

class TrafficListView extends BaseTruckyComponent
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

        var api = new TruckyServices();

        var traffic = await api.traffic(this.props.server, this.props.game);

        //console.log(traffic);

        if (traffic != null) {
            this.setState({
                dataSource: this
                    .state
                    .dataSource
                    .cloneWithRows(traffic)
            });            
        }

        this.setState({loading: false});
    }

    renderRow(rowData) {        
        return (
            <Card>
                <View>
                    <Text style={this.StyleManager.styles.trafficListRowHeaderText}>{rowData.country}</Text>
                </View>
                <View style={this.StyleManager.styles.trafficLocationsList}>
                    {this.renderLocations(rowData.locations, this)}
                </View>
            </Card>
        );
    }

    renderLocations(locations, container) {
        return locations.map(function(element) {
            return (
                <View>
                    <View style={ { flexDirection: 'row'}}>
                        <Text>{element.name}</Text>
                        <Text style={ { color: element.color}}> - {element.severity} ({element.players})</Text>
                    </View>
                </View>
            );
        });
    }   
    
    _onRefresh()
    {
        this.fetchData().done();
    }
    
    render()
    {
        return (
            <View style={this.StyleManager.styles.trafficListMainContainer}>
            {this.state.loading && <ActivityIndicator />}
                <View style={this.state.loading ? this.StyleManager.styles.hidden : {}}>
                    <ListView
                        style={this.StyleManager.styles.trafficListView}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        automaticallyAdjustContentInsets={false}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={this.StyleManager.styles.separator}/>}
                    />
                    <View style={this.StyleManager.styles.trafficCredits}>
                        <TouchableOpacity onPress={() => this.navigateUrl('https://traffic.krashnz.com/')}><Text>Traffic provided by https://traffic.krashnz.com/</Text></TouchableOpacity>
                    </View>                        
                </View>                
                {!this.state.loading &&
                <ActionButton
                    style={{container: this.StyleManager.styles.trafficActionButton}}
                    icon="refresh"
                    onPress={this
                    ._onRefresh
                    .bind(this)}/>
                }
            </View>
        );
    }
}

module.exports = TrafficListView;
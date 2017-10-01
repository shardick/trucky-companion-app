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
    TouchableHighlight,
    Image
} = ReactNative;

import {Toolbar, ActionButton, Card, Button, Icon} from 'react-native-material-ui';
import ActivityIndicator from './CustomActivityIndicator';
import BaseTruckyComponent from './BaseTruckyComponent';
import TruckyServices from '../Services/TruckyServices';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import PaginatedListView from 'react-native-paginated-listview'

class WOTGallery extends BaseTruckyComponent
{
    constructor()
    {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.state = {
            loadingNextPage: false,
            originalData: [],
            currentPage: 1,
            dataSource: ds.cloneWithRows([]),
            loading: true
        };
    }

    async fetchData()
    {
        if (!this.state.loadingNextPage)
            this.setState({loading: true});

        var api = new TruckyServices();

        var galleryResponse = null;

        switch (this.props.galleryType)
        {
            case 'editorsPick':
                galleryResponse = await api.wot_gallery_editorsPick(this.state.currentPage);
                break;
            case 'bestRated':
                galleryResponse = await api.wot_gallery_bestRated(this.state.currentPage);
                break;
            case 'newest':
                galleryResponse = await api.wot_gallery_newest(this.state.currentPage);
                break;
        }

        //console.log(traffic);
        var data = [...this.state.originalData, ...galleryResponse.gallery];

        if (galleryResponse != null && galleryResponse.gallery != null) {
            this.setState({
                originalData: data,
                dataSource: this
                .state
                .dataSource
                .cloneWithRows(data)
            })           
        }

        if (!this.state.loadingNextPage)
            this.setState({loading: false});
        
        this.setState({ loadingNextPage: false});
    }

    renderRow(rowData) {        
        return (
            <Card>
                <TouchableHighlight onPress={() => this.navigateUrl(rowData.imageDetailUrl)}>
                    <View style={this.StyleManager.styles.wotGalleryList}>
                        {this.renderGalleryItem(rowData, this)}
                    </View>
                </TouchableHighlight>
            </Card>
        );
    }

    async onFetch(page, count)
    {
        console.warn(page);

        var api = new TruckyServices();
        
                var galleryResponse = null;
        
                switch (this.props.galleryType)
                {
                    case 'editorsPick':
                        galleryResponse = await api.wot_gallery_editorsPick(page);
                        break;
                    case 'bestRated':
                        galleryResponse = await api.wot_gallery_bestRated(page);
                        break;
                    case 'newest':
                        galleryResponse = await api.wot_gallery_newest(page);
                        break;
                }            

                console.warn(galleryResponse.gallery.length);
                return galleryResponse.gallery;
    }

    renderGalleryItem(item, container) {
        return (<View>
                <Image resizeMode="cover"
                    style={this.StyleManager.styles.wotGalleryImage}
                    source={{uri: item.imageUrl}}
                    />
                <View style={this.StyleManager.styles.simpleRow}>
                    <FAIcon style={this.StyleManager.styles.wotGalleryProfileIcon} name="user" />
                    <Text>{item.author}</Text>
                </View>
                <View style={this.StyleManager.styles.simpleRow}>
                    <FAIcon style={this.StyleManager.styles.wotGalleryStatsIcon} name="eye" />
                    <Text style={this.StyleManager.styles.wotGalleryIconText}>{item.views}</Text>
                    <FAIcon style={this.StyleManager.styles.wotGalleryStatsIcon} name="heart" />
                    <Text style={this.StyleManager.styles.wotGalleryIconText}>{item.favs}</Text>
                    <FAIcon style={this.StyleManager.styles.wotGalleryStatsIcon} name="thumbs-up" />
                    <Text style={this.StyleManager.styles.wotGalleryIconText}>{item.likes}</Text>
                    <FAIcon style={this.StyleManager.styles.wotGalleryStatsIcon} name="comments-o" />
                    <Text>{item.comments}</Text>
                </View>
            </View>);
    }   
    
    _onRefresh()
    {
        this.fetchData().done();
    }

    onEndReached()
    {
        var instance = this;
        this.setState({loadingNextPage: true, currentPage: this.state.currentPage+1}, function() {
            //console.warn('onEndReached');
            //console.warn(JSON.stringify(this.state));
            this.fetchData().done();
        });
    }

    render()
    {
        return (
            <View style={this.StyleManager.styles.trafficListMainContainer}>
            {this.state.loading && <ActivityIndicator />}
                <View style={this.state.loading ? this.StyleManager.styles.hidden : {}}>
                    <ListView         
                        style={this.StyleManager.styles.wotGalleryListList}               
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        automaticallyAdjustContentInsets={false}
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={this.StyleManager.styles.separator}/>}
                        onEndReached={this.onEndReached.bind(this)}
                        onEndReachedThreshold={250}
                    />                  
                </View>                
                {!this.state.loading &&
                <ActionButton
                    style={{container: this.StyleManager.styles.actionButton}}
                    icon="refresh"
                    onPress={this
                    ._onRefresh
                    .bind(this)}/>
                }
            </View>
        );
    }
}

module.exports = WOTGallery;
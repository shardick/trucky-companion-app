import React, {Component} from 'react';
var ReactNative = require('react-native');
var {
    ActivityIndicator
} = ReactNative;
import SM from '../Styles/StyleManager';


/**
 * Little component for a common Activity Indicator accross the whole app
 * 
 * @class CustomActivityIndicator
 * @extends {Component}
 */
class CustomActivityIndicator extends Component
{
    constructor()
    {
        super();

        this.StyleManager = new SM();
    }

    render()
    {
        return(
            <ActivityIndicator style={this.StyleManager.styles.loader} size="large" color={this.StyleManager.styles.uiTheme.palette.primaryColor} />
        );
    }
}

module.exports = CustomActivityIndicator;
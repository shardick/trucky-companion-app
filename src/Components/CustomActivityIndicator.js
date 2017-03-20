import React, {Component} from 'react';
var ReactNative = require('react-native');
var {
    ActivityIndicator
} = ReactNative;
import styles from '../Styles';

class CustomActivityIndicator extends Component
{
    render()
    {
        return(
            <ActivityIndicator style={styles.loader} size="large" color={styles.uiTheme.palette.primaryColor} />
        );
    }
}

module.exports = CustomActivityIndicator;
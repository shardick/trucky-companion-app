import { View, StyleSheet } from 'react-native';
import React, { Component, PropTypes } from 'react';
import SM from '../Styles/StyleManager';

const propTypes = {
    children: PropTypes.node,
};


/**
 * Generic View Container with a common style
 * 
 * @class Container
 * @extends {BaseTruckyComponent}
 */
class Container extends Component {

    constructor()
    {
        super();
        this.StyleManager = new SM();
    }

    render() {
        return (
            <View style={this.StyleManager.styles.container}>
                {this.props.children}
            </View>
        );
    }
}

Container.propTypes = propTypes;

export default Container;

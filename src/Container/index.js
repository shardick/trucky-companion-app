import { View, StyleSheet } from 'react-native';
import React, { Component, PropTypes } from 'react';
import styles from '../Styles';

const propTypes = {
    children: PropTypes.node,
};

class Container extends Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
}

Container.propTypes = propTypes;

export default Container;

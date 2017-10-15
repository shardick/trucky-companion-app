/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SplitViewWindows } from 'react-native-windows';
var Button = require('react-native-windows/Libraries/Components/Button.windows');

class trucky extends Component {

  constructor(props)
  {
    super(props);
    this.splitView = null;
  }

  render() {
    var paneView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Pane!</Text>
      </View>
    );
    return (
      <SplitViewWindows
        ref={ (view) => { this.splitView = view }}
        paneWidth={300}
        panePosition={SplitViewWindows.positions.Left}
        renderPaneView={() => paneView}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
          <Button onPress={ () => this.splitView.openPane() } title="Click me" />
        </View>
      </SplitViewWindows>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('trucky', () => trucky);
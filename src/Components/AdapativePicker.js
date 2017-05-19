import React, {Component, PropTypes} from 'react'
var ReactNative = require('react-native');
import {Text, View, TouchableOpacity} from 'react-native';
import ModalPicker from 'react-native-modal-picker'
import Icon from 'react-native-vector-icons/FontAwesome';

class AdaptativePicker extends Component
{
    constructor(props)
    {
        super(props);

        //console.log(props.initialText); console.log(props.selectedValue);

        this.state = {
            selectedText: this.props.initialText,
            selectedValue: this.props.selectedValue
        };
    }

    componentDidMount()
    {
        this.getInitValue(this.props);
    }

    getInitValue(props)
    {
        //console.log('getInitValue');

        var instance = this;

        //console.log('props.selectedValue: ' + props.selectedValue);

        if (typeof(props.selectedValue) != 'undefined') {
            console.log('search for a label with key ' + props.selectedValue);

            var option = this
                .props
                .data
                .find((d) => {

                    return d.key == props.selectedValue;
                });

            this.setState({
                selectedText: option
                    ? option.label
                    : 'Select a value'
            });
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.getInitValue(nextProps);
    }

    onChange(option)
    {
        this
            .props
            .onChange(option);
    }

    onPress()
    {
        this
            .modalPicker
            .open();
    }

    render()
    {
        //console.log('render: selectedText ' + this.state.selectedText);

        return (
            <TouchableOpacity onPress={() => this.onPress()}>
                <ModalPicker
                    ref={(ref) => this.modalPicker = ref}
                    style={{
                    borderRadius: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    borderColor: 'grey',
                    borderWidth: 1,
                    alignItems: 'center'
                }}
                    optionContainer={styles.optionContainer}
                    optionTextStyle={styles.optionTextStyle}
                    data={this.props.data}
                    initValue={this.state.selectedText}
                    onChange={(option) => this.onChange(option)}>
                    <Text>{this.state.selectedText}</Text>

                </ModalPicker>
            </TouchableOpacity>
        )
    }
}

var styles = {
    optionTextStyle: {
        color: 'black'
    },
    optionContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 0
    },
    selectedValueContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        flex: 1
    }
};

AdaptativePicker.propTypes = {
    selectedValue: PropTypes.string,
    data: PropTypes.array,
    onChange: PropTypes.func,
    initialText: PropTypes.string
};

module.exports = AdaptativePicker;
import React, {Component, PropTypes} from 'react'
var ReactNative = require('react-native');
import ModalPicker from 'react-native-modal-picker'

class AdaptativePicker extends Component
{
    constructor(props)
    {
        super(props);

        //console.warn(this.props.initialText);

        this.state = {
            selectedText: this.props.initialText,
            selectedValue: this.props.selectedValue
        };
    }

    getInitValue(props)
    {
        //console.warn('getInitValue');

        var instance = this;

        //console.warn(props.selectedValue);

        if (typeof(props.selectedValue) != 'undefined') { 
            //console.warn('try to search');

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

    render()
    {
        //console.warn(this.state.selectedText);

        return <ModalPicker
            style={this.props.style}
            optionContainer={styles.optionContainer}
            optionTextStyle={styles.optionTextStyle}
            data={this.props.data}
            initValue={this.state.selectedText}
            onChange={(option) => this.onChange(option)}></ModalPicker>
    }
}

var styles = {
    optionTextStyle: {
        color: 'black'
    },
    optionContainer: {
        backgroundColor: 'white'
    }
};

AdaptativePicker.propTypes = {
    selectedValue: PropTypes.string,
    data: PropTypes.array,
    onChange: PropTypes.func,
    initialText: PropTypes.string
};

module.exports = AdaptativePicker;
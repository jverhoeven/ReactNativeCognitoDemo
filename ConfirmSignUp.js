import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';

import Message from './Message'
import styles from './GlobalStyles'

import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class ConfirmSignUp extends Component {
    confirmSignUp() {
        this.props.dispatch(actionCreators.confirmSignUp(this.props.email, this.props.verificationCode));
    }

    render() {
        return (
            <View style={styles.container}>
                <Message defaultMessage={"Enter verification code sent to '" + this.props.email + "'"} />
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                    style={styles.input}
                    autoFocus={true}
                    keyboardType="numeric"
                    onChangeText={(code) => this.props.dispatch(actionCreators.setVerificationCode(code))}
                    value={this.props.verificationCode}
                    />
                <Button style={styles.button} title="Confirm signup" onPress={this.confirmSignUp.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
    verificationCode: state.verificationCode,
})

export default connect(mapStateToProps)(ConfirmSignUp)

import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';

import Message from './Message'
import styles from './GlobalStyles'

import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class EnterCode extends Component {
    confirmForgotPassword() {
        this.props.dispatch(actionCreators.confirmForgotPassword(this.props.email, this.props.verificationCode, this.props.password));
    }

    render() {
        return (
            <View style={styles.container}>
                <Message defaultMessage="Enter verification code sent via mail" />
                <Text style={styles.label}>Verification code (sent via mail)</Text>
                <TextInput
                    style={styles.input}
                    autoFocus={true}
                    keyboardType="numeric"
                    onChangeText={(code) => this.props.dispatch(actionCreators.setVerificationCode(code))}
                    value={this.props.verificationCode}
                    />
                <Text style={styles.label}>New password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(password) => this.props.dispatch(actionCreators.setPassword(password))}
                    value={this.props.password}
                    />
                <Button style={styles.button} title="Reset password" onPress={this.confirmForgotPassword.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
    password: state.password,
    verificationCode: state.verificationCode,
})

export default connect(mapStateToProps)(EnterCode)

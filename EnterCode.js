import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class EnterCode extends Component {
    message() {
        const {positions, loading, error, loginStep, dispatch, message} = this.props
        if (loading) {
            return (<ActivityIndicator animating={true} />);
        } else if (error) {
            return (<Text>{message}</Text>);
        } else {
            return (<Text>Enter verification code sent</Text>);
        }
    }

    reset() {
        this.props.dispatch(actionCreators.reset(this.props.email, this.props.verificationCode, this.props.password));
    }

    render() {
        const {positions, loading, error, loginStep, dispatch} = this.props

        return (
            <View style={styles.container}>
                <Text /> 
                {this.message()}
                <Text /> 
                <Text style={styles.label}>Verification code (sent via mail)</Text>
                <TextInput
                    style={styles.input}
                    autoFocus={true}
                    keyboardType="numeric"
                    onChangeText={(code) => dispatch(actionCreators.setVerificationCode(code))}
                    value={this.props.verificationCode}
                    />
                <Text style={styles.label}>New password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(password) => dispatch(actionCreators.setPassword(password))}
                    value={this.props.password}
                    />
                <Button style={styles.button} title="Reset password" onPress={this.reset.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading,
    error: state.error,
    message: state.message,
    email: state.email,
    password: state.password,
    verificationCode: state.verificationCode,
    loginStep: state.loginStep,
})

export default connect(mapStateToProps)(EnterCode)

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,   
        paddingVertical: 20,   
    },
    label: {
        height: 20,
    },
    input: {
        height: 30,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    button: {
        height: 40,
    }
})

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

class ConfirmSignUp extends Component {
    message() {
        const {positions, loading, error, loginStep, dispatch, message} = this.props
        if (loading) {
            return (<ActivityIndicator animating={true} />);
        } else if (error) {
            return (<Text>{message}</Text>);
        } else {
            return (<Text>Enter verification code sent to {this.props.email}</Text>);
        }
    }

    confirmSignUp() {
        this.props.dispatch(actionCreators.confirmSignUp(this.props.email, this.props.verificationCode));
    }

    render() {
        const {positions, loading, error, loginStep, dispatch} = this.props

        return (
            <View style={styles.container}>
                <Text /> 
                {this.message()}
                <Text /> 
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                    style={styles.input}
                    autoFocus={true}
                    keyboardType="numeric"
                    onChangeText={(code) => dispatch(actionCreators.setVerificationCode(code))}
                    value={this.props.verificationCode}
                    />
                <Button style={styles.button} title="Confirm signup" onPress={this.confirmSignUp.bind(this)} />
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

export default connect(mapStateToProps)(ConfirmSignUp)

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

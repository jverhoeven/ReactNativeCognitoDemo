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

import { actionCreators, loginSteps } from './accountredux'

class Signup extends Component {
    message() {
        const {positions, loading, error, loginStep, dispatch, message} = this.props
        if (loading) {
            return (<ActivityIndicator animating={true} />);
        } else if (error) {
            return (<Text>{message}</Text>);
        } else {
            return (<Text>Enter email and password to signup</Text>);
        }
    }

    signup() {
        this.props.dispatch(actionCreators.signup(this.props.email, this.props.password));
        console.log("Pressed signup");
    }

    back() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.LOGIN));
    }

    confirmSignUp() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.CONFIRM_SIGNUP));
    }

    render() {
        const {positions, loading, error, loginStep, dispatch} = this.props

        return (
            <View style={styles.container}>
                <Text /> 
                {this.message()}
                <Text /> 
                <Text style={styles.label}>E-mail address</Text>
                <TextInput
                    style={styles.input}
                    keyboardType={"email-address"}
                    onChangeText={(email) => dispatch(actionCreators.setEmail(email))}
                    value={this.props.email}
                    />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(password) => dispatch(actionCreators.setPassword(password))}
                    value={this.props.password}
                    />
                <Button style={styles.button} title="Signup" onPress={this.signup.bind(this)} />
                <Button style={styles.button} title="I already received a code" onPress={this.confirmSignUp.bind(this)} />
                <Button style={styles.button} title="Back" onPress={this.back.bind(this)} />
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
    loginStep: state.loginStep,
})

export default connect(mapStateToProps)(Signup)

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

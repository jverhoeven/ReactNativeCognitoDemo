import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import { connect } from 'react-redux'

import { actionCreators, loginSteps } from './accountredux'

import Message from './Message'
import styles from './GlobalStyles'

class Login extends Component {
    login() {
        this.props.dispatch(actionCreators.login(this.props.email, this.props.password));
    }

    forgot() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.FORGOT));
    }

    signup() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.SIGNUP));
    }

    render() {
        return (
            <View style={styles.container}>
                <Message defaultMessage="Enter email and password to login" />
                <Text style={styles.label}>E-mail address</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(email) => this.props.dispatch(actionCreators.setEmail(email))}
                    value={this.props.email}
                    />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(password) => this.props.dispatch(actionCreators.setPassword(password))}
                    value={this.props.password}
                    />
                <Button title="Login" onPress={this.login.bind(this)} />
                <Button title="Forgot password" onPress={this.forgot.bind(this)} />
                <Button title="Signup" onPress={this.signup.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
    password: state.password,
})

export default connect(mapStateToProps)(Login)

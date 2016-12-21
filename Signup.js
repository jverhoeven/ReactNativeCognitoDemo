import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import Message from './Message'
import styles from './GlobalStyles'

import { connect } from 'react-redux'

import { actionCreators, loginSteps } from './accountredux'

class Signup extends Component {
    signup() {
        this.props.dispatch(actionCreators.signup(this.props.email, this.props.password));
    }

    back() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.LOGIN));
    }

    confirmSignUp() {
        this.props.dispatch(actionCreators.navigateTo(loginSteps.CONFIRM_SIGNUP));
    }

    render() {
        const {dispatch, email, password} = this.props

        return (
            <View style={styles.container}>
                <Message defaultMessage="Enter email and password to signup" />
                <Text style={styles.label}>E-mail address</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(newEmail) => dispatch(actionCreators.setEmail(newEmail))}
                    value={email}
                    />
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={(newPassword) => dispatch(actionCreators.setPassword(newPassword))}
                    value={password}
                    />
                <Button title="Signup" onPress={this.signup.bind(this)} />
                <Button title="I already received a code" onPress={this.confirmSignUp.bind(this)} />
                <Button title="Back" onPress={this.back.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
    password: state.password,
})

export default connect(mapStateToProps)(Signup)

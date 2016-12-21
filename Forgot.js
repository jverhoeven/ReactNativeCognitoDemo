import React, { Component } from 'react';
import { Text, View, Button, TextInput } from 'react-native';
import Message from './Message'
import styles from './GlobalStyles'

import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class Forgot extends Component {
    forgot() {
        this.props.dispatch(actionCreators.forgot(this.props.email));
    }

    render() {
        return (
            <View style={styles.container}>
                <Message defaultMessage="Enter email of the account to reset the password for" />
                <Text style={styles.label}>E-mail address</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(email) => this.props.dispatch(actionCreators.setEmail(email))}
                    value={this.props.email}
                    />
                <Button title="Reset password" onPress={this.forgot.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
})

export default connect(mapStateToProps)(Forgot)

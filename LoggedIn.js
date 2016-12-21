import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
} from 'react-native';

import Message from './Message'
import styles from './GlobalStyles'

import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class LoggedIn extends Component {
    logout() {
        this.props.dispatch(actionCreators.logout(this.props.email));
    }

    render() {
        return (
            <View style={styles.container}>
                <Message defaultMessage={"You are logged in as '" + this.props.email + "'"} />
                <Button title="Logout" onPress={this.logout.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
})

export default connect(mapStateToProps)(LoggedIn)

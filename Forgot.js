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

class Forgot extends Component {
    message() {
        const {positions, loading, error, loginStep, dispatch, message} = this.props
        if (loading) {
            return (<ActivityIndicator animating={true} />);
        } else if (error) {
            return (<Text>{message}</Text>);
        } else {
            return (<Text>Enter email of the account to reset the password for</Text>);
        }
    }

    forgot() {
        this.props.dispatch(actionCreators.forgot(this.props.email));
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
                    onChangeText={(email) => dispatch(actionCreators.setEmail(email))}
                    value={this.props.email}
                    />
                <Button style={styles.button} title="Reset password" onPress={this.forgot.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading,
    error: state.error,
    message: state.message,
    email: state.email,
    loginStep: state.loginStep,
})

export default connect(mapStateToProps)(Forgot)

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

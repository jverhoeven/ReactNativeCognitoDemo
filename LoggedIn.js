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

class LoggedIn extends Component {
    message() {
        const {loading, error, message} = this.props;
        if (loading) {
            return (<ActivityIndicator animating={true} />);
        } else if (error) {
        return (<Text>{message}</Text>);
        } else {
            return (<Text>You are logged in as '{this.props.email}'</Text>);
        }
    }

    logout() {
        this.props.dispatch(actionCreators.logout(this.props.email));
        console.log("Pressed logout");
    }

    render() {
        return (
            <View style={styles.container}>
                <Text /> 
                {this.message()}
                <Text /> 
                <Button style={styles.button} title="Logout" onPress={this.logout.bind(this)} />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.email,
    message: state.message,
})

export default connect(mapStateToProps)(LoggedIn)

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,   
        paddingVertical: 20,   
    },
    label: {
        height: 20,
    },
    button: {
        height: 40,
    }
})

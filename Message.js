import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux'

import { actionCreators } from './accountredux'

class Message extends Component {
    render() {
        const {loading, error, defaultMessage} = this.props
        if (loading) {
            return (<View><ActivityIndicator animating={true} /><Text /></View>);
        } else if (error) {
            return (<View><Text>{error.text}</Text><Text /></View>);
        } else {
            return (<View><Text>{defaultMessage}</Text><Text /></View>);
        }
    }
}

const mapStateToProps = (state) => ({
    loading: state.loading,
    error: state.error,
})

export default connect(mapStateToProps)(Message)

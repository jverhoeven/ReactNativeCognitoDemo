import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Login from './Login'
import Signup from './Signup'
import ConfirmSignUp from './ConfirmSignUp'
import EnterCode from './EnterCode'
import LoggedIn from './LoggedIn'
import Forgot from './Forgot'

import { connect } from 'react-redux'
import { actionCreators, loginSteps } from './accountredux'

class App extends Component {
    constructor(props) {
        super(props);
        console.log("Constructor of App called");
        props.dispatch(actionCreators.retrieveCredentialsFromLocalStorageAndTryToLogin());
    }

    render() {
        console.log("Rendering App");
        const {loginStep} = this.props

        if (loginStep === loginSteps.LOGIN) {
            return (
                <Login />
            )
        } else if (loginStep === loginSteps.SIGNUP) {
            return (<Signup />);
        } else if (loginStep === loginSteps.CONFIRM_SIGNUP) {
            return (<ConfirmSignUp/>);
        } else if (loginStep === loginSteps.ENTER_CODE) {
            return (<EnterCode/>);
        } else if (loginStep === loginSteps.FORGOT) {
            return (<Forgot />);
        } else if (loginStep === loginSteps.LOGGEDIN) {
            return (<LoggedIn/>);
        } else {
            return (<View><Text>Navigation destination not implemented</Text></View>);
        }
    }
}

const mapStateToProps = (state) => ({
    loginStep: state.loginStep,
})

export default connect(mapStateToProps)(App);

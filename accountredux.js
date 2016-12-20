import React from 'react'

import {AsyncStorage} from 'react-native'

import RNCognitoIdentity from 'react-native-cognito-identity';

import awsConfig from './awsconfig'

export const loginSteps = {
    LOGIN: 'LOGIN',
    SIGNUP: 'SIGNUP',
    CONFIRM_SIGNUP: 'CONFIRM_SIGNUP',
    FORGOT: 'FORGOT',
    ENTER_CODE: 'ENTER_CODE',
    LOGGEDIN: 'LOGGEDIN',
}

export const types = {
    START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: 'START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN', 
    COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: 'COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN', 
    SIGNUP_REQUEST: 'SIGNUP_REQUEST',
    SIGNUP_RESPONSE: 'SIGNUP_RESPONSE',
    CONFIRM_SIGNUP_REQUEST: 'CONFIRM_SIGNUP_REQUEST',
    CONFIRM_SIGNUP_RESPONSE: 'CONFIRM_SIGNUP_RESPONSE',
    GET_SESSION_REQUEST: 'GET_SESSION_REQUEST',
    GET_SESSION_RESPONSE: 'GET_SESSION_RESPONSE',
    CONFIRM_FORGOT_PASSWORD_REQUEST: 'CONFIRM_FORGOT_PASSWORD_REQUEST',
    CONFIRM_FORGOT_PASSWORD_RESPONSE: 'CONFIRM_FORGOT_PASSWORD_RESPONSE',
    FORGOT_PASSWORD_REQUEST: 'FORGOT_PASSWORD_REQUEST',
    FORGOT_PASSWORD_RESPONSE: 'FORGOT_PASSWORD_RESPONSE',
    LOGOUT: 'LOGOUT',
    NAVIGATE_TO: 'NAVIGATE_TO',
    SET_CREDENTIALS_EMAIL: 'SET_CREDENTIALS_EMAIL',
    SET_CREDENTIALS_PASSWORD: 'SET_CREDENTIALS_PASSWORD',
    SET_CREDENTIALS_VERIFICATION_CODE: 'SET_CREDENTIALS_VERIFICATION_CODE',
}

RNCognitoIdentity.initWithOptions(awsConfig.region, awsConfig.user_pool_id, awsConfig.client_id);

// TODO: Enumerate errors, internationalize
normalizeAWSException = (exception) => {
    if ('userInfo' in exception) {
        if ('__type' in exception.userInfo) {
            return {code: exception.userInfo.__type, text: exception.userInfo.message};
        }
    }
    return {code: "UnknownError", text: "An unknown error occurred"};
}

// TODO: Internationalize
normalizeErrorMessage = (message) => {
    return {code: "UnknownError", text: message}
}

export const actionCreators = {
    retrieveCredentialsFromLocalStorageAndTryToLogin: () => async(dispatch, getState) => {
        dispatch({ type: types.START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN });
        try {
            const email = await AsyncStorage.getItem('@DemoApp:email');
            const password = await AsyncStorage.getItem('@DemoApp:password');
            if (email && password && email !== '' && password !== '') {
                try {
                    var session = await RNCognitoIdentity.getSession(email, password);
                    console.log("The idToken: " + session["idToken"]);
                    console.log("The accessToken: " + session["accessToken"]);
                    console.log("The refreshToken: " + session["refreshToken"]);
                    console.log("The expirationTime: " + session["expirationTime"]); //iOS only
                    dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, session: session, email: email, password: password })
                } catch(e) {
                    dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, error: normalizeAWSException(e), email: email, password: password })
                }
            } else {
                dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, email: email, password: password });
            }
        } catch(e) {
            dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, email: '', password: '' });
        }
    },

    signup: (email, password) => async (dispatch, getState) => {
        dispatch({ type: types.SIGNUP_REQUEST, email: email, password: password});
        try {
            const signupResponse = await RNCognitoIdentity.signUp(email, password);
            result = await AsyncStorage.setItem('@DemoApp:email', email);
            result = await AsyncStorage.setItem('@DemoApp:password', password);
            dispatch({type: types.SIGNUP_RESPONSE, error: null});
        } catch (e) {
            dispatch({type: types.SIGNUP_RESPONSE, error: normalizeAWSException(e)});
        }
    },

    login: (email, password) => async (dispatch, getState) => {
        dispatch({ type: types.GET_SESSION_REQUEST })

        try {
            var session = await RNCognitoIdentity.getSession(email, password);
            result = await AsyncStorage.setItem('@DemoApp:email', email);
            result = await AsyncStorage.setItem('@DemoApp:password', password);
            console.log("The idToken: " + session["idToken"]);
            console.log("The accessToken: " + session["accessToken"]);
            console.log("The refreshToken: " + session["refreshToken"]);
            console.log("The expirationTime: " + session["expirationTime"]); //iOS only

            dispatch({ type: types.GET_SESSION_RESPONSE, error: null, session: session, email: email, password: password })
        } catch (e) {
            dispatch({ type: types.GET_SESSION_RESPONSE, error: normalizeAWSException(e) })
        }
    },
    logout: (email) => async(dispatch, getState) => {
        try {
            result = await AsyncStorage.setItem('@DemoApp:password', '');
            RNCognitoIdentity.logout(email);
            dispatch({ type: types.LOGOUT, error: null, password: '' });
        } catch(e) {
            dispatch({ type: types.LOGOUT, error: normalizeAWSException(e) });
        }
    },
    navigateTo: (screen) => async(dispatch, getState) => {
        dispatch({type: types.NAVIGATE_TO, screen: screen });
    },
    forgot: (email) => async(dispatch, getState) => {
        dispatch({ type: types.FORGOT_PASSWORD_REQUEST })
        try {
            result = await RNCognitoIdentity.forgotPassword(email);
            if (result === email) {
                result = await AsyncStorage.setItem('@DemoApp:password', '');
                dispatch({ type: types.FORGOT_PASSWORD_RESPONSE });
            } else {
                dispatch({ type: types.FORGOT_PASSWORD_RESPONSE, error: "Unable to send forgotten password to server. Try again later." });
            }
        } catch(e) {
            dispatch({ type: types.FORGOT_PASSWORD_RESPONSE, error: normalizeAWSException(e) });
        }
    },
    confirmSignUp: (email, verificationCode) => async(dispatch, getState) => {
        dispatch({ type: types.CONFIRM_SIGNUP_REQUEST })
        try {
            result = await RNCognitoIdentity.confirmSignUp(email, verificationCode);
            if (result === email) {
                dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE });
            } else {
                dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE, error: normalizeErrorMessage("Something went wrong. Try again") });
            }
        } catch(e) {
            dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE, error: normalizeAWSException(e) });
        }
    },
    confirmForgotPassword: (email, verificationCode, password) => async(dispatch, getState) => {
        dispatch({ type: types.CONFIRM_FORGOT_PASSWORD_REQUEST })
        try {
            result = await RNCognitoIdentity.confirmForgotPassword(email, password, verificationCode);
            if (result === email) {
                result = await AsyncStorage.setItem('@DemoApp:password', password);
                dispatch({ type: types.CONFIRM_FORGOT_PASSWORD_RESPONSE, email: email, password: password });
            } else {
                dispatch({ type: types.CONFIRM_FORGOT_PASSWORD_RESPONSE, error: normalizeErrorMessage("Something went wrong. Try again") });
            }
        } catch(e) {
            dispatch({ type: types.CONFIRM_FORGOT_PASSWORD_RESPONSE, error: normalizeAWSException(e) });
        }
    },
    setEmail: (email) => (dispatch, getState) => {
        dispatch({ type: types.SET_CREDENTIALS_EMAIL, email: email });
    },
    setPassword: (password) => (dispatch, getState) => {
        dispatch({ type: types.SET_CREDENTIALS_PASSWORD, password: password });
    },
    setVerificationCode: (code) => (dispatch, getState) => {
        dispatch({ type: types.SET_CREDENTIALS_VERIFICATION_CODE, verificationCode: code });
    }
}

const initialState = {
    loading: true,
    error: null,
    email: null,
    verificationCode: null,
    password: null,
    session: null,
    loginStep: loginSteps.LOGIN,
}

export const reducer = (state = initialState, action) => {
    console.log("reducing with action " + action.type);

    switch (action.type) {
        case types.SIGNUP_REQUEST: {
            return {...state, loading: true, error: null }
        }
        case types.SIGNUP_RESPONSE: {
            const {error} = action
            if (error) {
                // Typically NotAuthorizedException or UsernameExistsException
                return {...state, loading: false, error: error }
            } else {
                return {...state, loading: false, error: null, loginStep: loginSteps.CONFIRM_SIGNUP}
            }
        }
        case types.CONFIRM_SIGNUP_REQUEST: {
            return {...state, loading: true, error: null }
        }
        case types.CONFIRM_SIGNUP_RESPONSE: {
            const {error} = action
            if (error) {
                // Only seen LimitExceededException so far
                return {...state, loading: false, error: error }
            } else {
                return {...state, loading: false, error: null, verificationCode: '', loginStep: loginSteps.LOGIN}
            }
        }
        case types.GET_SESSION_REQUEST: {
            return {...state, loading: true, error: null }
        }
        case types.GET_SESSION_RESPONSE: {
            const {session, error} = action
            if (error) {
                // Typically: NotAuthorizedException
                return {...state, loading: false, error: error, session: null }
            } else {
                return {...state, loading: false, error: null, session: session, loginStep: loginSteps.LOGGEDIN}
            }
        }
        case types.FORGOT_PASSWORD_REQUEST: {
            return {...state, loading: true, error: null }
        }
        case types.FORGOT_PASSWORD_RESPONSE: {
            const {error} = action
            if (error) {
                // Only seen LimitExceededException so far
                return {...state, loading: false, error: error }
            } else {
                return {...state, loading: false, error: null, password: '', loginStep: loginSteps.ENTER_CODE}
            }
        }
        case types.CONFIRM_FORGOT_PASSWORD_REQUEST: {
            return {...state, loading: true, error: null }
        }
        case types.CONFIRM_FORGOT_PASSWORD_RESPONSE: {
            const {error} = action
            if (error) {
                // Only seen LimitExceededException so far
                return {...state, loading: false, error: error }
            } else {
                return {...state, loading: false, error: null, loginStep: loginSteps.LOGIN}
            }
        }
        case types.LOGOUT: {
            const {error} = action
            if (error) {
                return {...state, loading: false, session: null, error: error, loginStep: loginSteps.LOGIN}
            } else {
                return {...state, loading: false, session: null, error: null, password: '', loginStep: loginSteps.LOGIN}
            }
        }
        case types.NAVIGATE_TO: {
            return {...state, loading: false, error: null, loginStep: action.screen }
        }
        case types.START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: {
            return {...state, loading: true, error: null }
        }
        case types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: {
            const {email, password, error, session } = action
            if (error) {
                return {...state, loading: false, error: error }
            } else {
                if (session) {
                    // There is a session. We are logged in.
                    return { ...state, email: email, password: password, session: session, loading: false, error: null, loginStep: loginSteps.LOGGEDIN  }
                } else {
                    // No session, probably empty credentials.
                    return { ...state, email: email, password: password, loading: false, error: null, loginStep: loginSteps.LOGIN }
                }
            }
        }
        case types.SET_CREDENTIALS_EMAIL: {
            const {email} = action;
            return {...state, email: email }
        }
        case types.SET_CREDENTIALS_PASSWORD: {
            const {password} = action;
            return {...state, password: password }
        }
        case types.SET_CREDENTIALS_VERIFICATION_CODE: {
            const {verificationCode} = action;
            return {...state, verificationCode: verificationCode }
        }
    }

    return state
}

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
    RESET_PASSWORD_REQUEST: 'RESET_PASSWORD_REQUEST',
    RESET_PASSWORD_RESPONSE: 'RESET_PASSWORD_RESPONSE',
    FORGOT_PASSWORD_REQUEST: 'FORGOT_PASSWORD_REQUEST',
    FORGOT_PASSWORD_RESPONSE: 'FORGOT_PASSWORD_RESPONSE',
    AUTHENTICATE_REQUEST: 'AUTHENTICATE_REQUEST',
    AUTHENTICATE_RESPONSE: 'AUTHENTICATE_RESPONSE',
    LOGOUT: 'LOGOUT',
    NAVIGATE_TO: 'NAVIGATE_TO',
    SET_CREDENTIALS_EMAIL: 'SET_CREDENTIALS_EMAIL',
    SET_CREDENTIALS_PASSWORD: 'SET_CREDENTIALS_PASSWORD',
    SET_CREDENTIALS_VERIFICATION_CODE: 'SET_CREDENTIALS_VERIFICATION_CODE',
}

RNCognitoIdentity.initWithOptions(awsConfig.region, awsConfig.user_pool_id, awsConfig.client_id);

export const actionCreators = {
    retrieveCredentialsFromLocalStorageAndTryToLogin: () => async(dispatch, getState) => {
        dispatch({ type: types.START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN });
        try {
            const email = await AsyncStorage.getItem('@DemoApp:email');
            const password = await AsyncStorage.getItem('@DemoApp:password');
            if (email && password && email !== '' && password !== '') {
                try {
                    var session = await RNCognitoIdentity.authenticateUserAsync(email, password);
                    console.log("The idToken: " + session["idToken"]);
                    console.log("The accessToken: " + session["accessToken"]);
                    console.log("The refreshToken: " + session["refreshToken"]);
                    console.log("The expirationTime: " + session["expirationTime"]); //iOS only
                    dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, payload: session, email: email, password: password })
                } catch(e) {
                    dispatch({ type: types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN, payload: e, email: email, password: password })
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
            dispatch({type: types.SIGNUP_RESPONSE, payload: signupResponse, email: email, password: password});
        } catch (e) {
            dispatch({type: types.SIGNUP_RESPONSE, payload: e, error: true});
        }
    },

    login: (email, password) => async (dispatch, getState) => {
        dispatch({ type: types.AUTHENTICATE_REQUEST })

        try {
            var session = await RNCognitoIdentity.authenticateUserAsync(email, password);
            result = await AsyncStorage.setItem('@DemoApp:email', email);
            result = await AsyncStorage.setItem('@DemoApp:password', password);
            console.log("The idToken: " + session["idToken"]);
            console.log("The accessToken: " + session["accessToken"]);
            console.log("The refreshToken: " + session["refreshToken"]);
            console.log("The expirationTime: " + session["expirationTime"]); //iOS only

            dispatch({ type: types.AUTHENTICATE_RESPONSE, payload: session, email: email, password: password })
        } catch (e) {
            dispatch({ type: types.AUTHENTICATE_RESPONSE, payload: e, error: true })
        }
    },
    logout: (email) => async(dispatch, getState) => {
        try {
            result = await AsyncStorage.setItem('@DemoApp:password', '');
            RNCognitoIdentity.logout(email);
            dispatch({ type: types.LOGOUT, password: '' });
        } catch(e) {
            dispatch({ type: types.LOGOUT, payload: e, error: true });
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
                dispatch({ type: types.FORGOT_PASSWORD_RESPONSE, password: '' });
            } else {
                dispatch({ type: types.FORGOT_PASSWORD_RESPONSE, payload: "Server did not forget the user", error: true });
            }
        } catch(e) {
            dispatch({ type: types.FORGOT_PASSWORD_RESPONSE, payload: e, error: true });
        }
    },
    confirmSignUp: (email, verificationCode) => async(dispatch, getState) => {
        dispatch({ type: types.CONFIRM_SIGNUP_REQUEST })
        try {
            result = await RNCognitoIdentity.confirmSignUp(email, verificationCode);
            if (result === email) {
                dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE });
            } else {
                dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE, payload: "Something went wrong. Try again", error: true });
            }
        } catch(e) {
            dispatch({ type: types.CONFIRM_SIGNUP_RESPONSE, payload: e, error: true });
        }
    },
    reset: (email, verificationCode, password) => async(dispatch, getState) => {
        dispatch({ type: types.RESET_PASSWORD_REQUEST })
        try {
            result = await RNCognitoIdentity.confirmForgotPassword(email, password, verificationCode);
            if (result === email) {
                result = await AsyncStorage.setItem('@DemoApp:password', password);
                dispatch({ type: types.RESET_PASSWORD_RESPONSE, password: password, email: email });
            } else {
                dispatch({ type: types.RESET_PASSWORD_RESPONSE, payload: "Something went wrong. Try again", error: true });
            }
        } catch(e) {
            dispatch({ type: types.RESET_PASSWORD_RESPONSE, payload: e, error: true });
        }
    },
    setEmail: (email) => (dispatch, getState) => {
        console.log("issued new email");
        dispatch({ type: types.SET_CREDENTIALS_EMAIL, email: email });
    },
    setPassword: (password) => (dispatch, getState) => {
        console.log("issued new password");
        dispatch({ type: types.SET_CREDENTIALS_PASSWORD, password: password });
    },
    setVerificationCode: (code) => (dispatch, getState) => {
        console.log("issued new password");
        dispatch({ type: types.SET_CREDENTIALS_VERIFICATION_CODE, verificationCode: code });
    }
}

const initialState = {
    loading: true,
    error: false,
    email: null,
    verificationCode: null,
    password: null,
    session: null,
    message: null,
    loginStep: loginSteps.LOGIN,
}

export const reducer = (state = initialState, action) => {
    const {type, payload, error, position, viewport} = action;

    console.log("reducing with action " + type);

    switch (type) {
        case types.SIGNUP_REQUEST: {
            return {...state, loading: true, error: false }
        }
        case types.SIGNUP_RESPONSE: {
            const {email, password} = action
            if (error) {
                console.log("SIGNUP_RESPONSE error occured: " + payload)
                if (payload.userInfo.__type === "NotAuthorizedException") {
                    return {...state, loading: false, error: true, message: "Email address or password are not allowed." }
                } else if (payload.userInfo.__type === "UsernameExistsException") {
                    return {...state, loading: false, error: true, message: "This email address has already been registered."}
                }
                return {...state, loading: false, error: true }
            } else {
                return {...state, loading: false, error: false, session: payload, loginStep: loginSteps.CONFIRM_SIGNUP}
            }
        }
        case types.CONFIRM_SIGNUP_REQUEST: {
            return {...state, loading: true, error: false }
        }
        case types.CONFIRM_SIGNUP_RESPONSE: {
            if (error) {
                console.log("CONFIRM_SIGNUP_RESPONSE error occured: " + payload)
                if (payload.userInfo.__type === "LimitExceededException") {
                    return {...state, loading: false, error: true, message: "Password reset rate limit exceeded. Try again later." }
                } else {
                    return {...state, loading: false, error: true, message: "An unknown error occured" }
                }
            } else {
                return {...state, loading: false, error: false, verificationCode: '', loginStep: loginSteps.LOGIN}
            }
        }
        case types.AUTHENTICATE_REQUEST: {
            return {...state, loading: true, error: false }
        }
        case types.AUTHENTICATE_RESPONSE: {
            const {email, password} = action
            if (error) {
                console.log("AUTHENTICATE_RESPONSE error occured: " + payload)
                if (payload.userInfo.__type === "NotAuthorizedException") {
                    return {...state, loading: false, error: true, message: "Email address or password incorrect." }
                } else {
                    return {...state, loading: false, error: true, message: "An unknown error occured" }
                }
                return {...state, loading: false, error: true }
            } else {
                return {...state, loading: false, error: false, session: payload, loginStep: loginSteps.LOGGEDIN}
            }
        }
        case types.FORGOT_PASSWORD_REQUEST: {
            return {...state, loading: true, error: false }
        }
        case types.FORGOT_PASSWORD_RESPONSE: {
            if (error) {
                console.log("FORGOT_PASSWORD_RESPONSE error occured: " + payload)
                if (payload.userInfo.__type === "LimitExceededException") {
                    return {...state, loading: false, error: true, message: "Password reset rate limit exceeded. Try again later." }
                } else {
                    return {...state, loading: false, error: true, message: "An unknown error occured" }
                }
            } else {
                return {...state, loading: false, error: false, password: '', loginStep: loginSteps.ENTER_CODE}
            }
        }
        case types.RESET_PASSWORD_REQUEST: {
            return {...state, loading: true, error: false }
        }
        case types.RESET_PASSWORD_RESPONSE: {
            if (error) {
                console.log("RESET_PASSWORD_RESPONSE error occured: " + payload)
                if (payload.userInfo.__type === "LimitExceededException") {
                    return {...state, loading: false, error: true, message: "Password reset rate limit exceeded. Try again later." }
                } else {
                    return {...state, loading: false, error: true, message: "An unknown error occured" }
                }
            } else {
                return {...state, loading: false, error: false, loginStep: loginSteps.LOGIN}
            }
        }
        case types.LOGOUT: {
            return {...state, loading: false, session: null, password: '', loginStep: loginSteps.LOGIN}
        }
        case types.NAVIGATE_TO: {
            return {...state, loading: false, error: false, loginStep: action.screen }
        }
        case types.START_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: {
            return {...state, loading: true, error: false }
        }
        case types.COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN: {
            const {email, password, error, payload } = action
            if (error) {
                console.log("COMPLETED_CREDENTIALS_RETRIEVAL_FROM_LOCAL_STORAGE_AND_TRY_LOGIN error occured: " + payload)
                return {...state, loading: false, error: true }
            } else {
                return { ...state, email: email, password: password, loading: false, error: false, loginStep: loginSteps.LOGGEDIN  }
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

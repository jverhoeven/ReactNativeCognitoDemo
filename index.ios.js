/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text
} from 'react-native';


import { connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import { reducer } from './accountredux'

import App from './App'

import { composeWithDevTools } from 'remote-redux-devtools';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

class ReactNativeCognitoDemo extends Component {
    render() {
        console.log("Rendering ReactNativeCognitoDemo");
        return (
            <Provider store={store}>
                <View>
                    <App />
                </View>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('ReactNativeCognitoDemo', () => ReactNativeCognitoDemo);

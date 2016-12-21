import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import { reducer } from './accountredux'

import App from './App'

import { composeWithDevTools } from 'remote-redux-devtools';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

class ReactNativeCognitoDemo extends Component {
    render() {
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

# ReactNativeCognitoDemo
This is a test app for the react-native-cognito-identity repo.

# Purpose
The goal of this project is to demonstrate/test the use of the AWS Cognito Identity management functionality. It is a bare bones React-Native application that shows:

1. Sign up of a new user, resulting in a mail with verification code
2. Enter signup verification code to complete signup
3. Login with the new credentials and get JWT tokens
4. Run a forgot password scenario with a verification code sent via mail

# Installation

```bash
git clone https://github.com/jverhoeven/ReactNativeCognitoDemo
cd ReactNativeCognitoDemo
npm install
react-native link
```

This will install the app and the library react-native-cognito-identity. 

### Extra steps for iOS
The library requires the iOS framework files. These can be installed by 

1. downloading the AWS SDK for iOS from https://aws.amazon.com/mobile/sdk/
2. Unpack it, from the /Frameworks folder take 

		AWSCognito.framework
		AWSCognitoIdentityProvider.framework
		AWSCore.framework
	
	and copy them into the node_modules/react-native-cognito-identity/ios/Frameworks/ folder.

# Configuration

First go to the Cognito in the AWS management console and make sure you have a user pool. Write down the following attributes:

1. Pool Id: You can find this in the tab 'Pool details'.
2. App client Id: You will find this in the tab 'Apps'.
3. Region: The AWS region code. Note: Currently eu-west-1 is hardcoded for Android. Please make a PR to fix this :-
3. Create a config file and name it 'awsconfig.js' and put it in the root folder (next to the App.js):

```javascript
export default awsConfig = {
    "region": "eu-west-1",
    "user_pool_id": "eu-west-1_xxxxxxxxx",
    "client_id": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
};
```


# Running it
Once you have completed all the previous steps, just run react-native for the platform of your choice.

```bash
react-native run-ios

or 

react-native run-android
```


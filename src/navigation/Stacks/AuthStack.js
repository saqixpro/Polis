import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../../Screens/Login';
import Signup from '../../Screens/Signup';
//AuthStack
const authStack = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: {
        headerShown: false,
      },
    },

    Signup: {
      screen: Signup,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {initialRouteName: 'Login'},
);

export default authStack;

import React from 'react';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import Splash from '../Screens/Splash';

//Stacks
import AuthStack from './Stacks/AuthStack';
import MainStack from './Stacks/MainStack';
const AppNavigator = createSwitchNavigator(
  {
    Splash: {
      screen: Splash,
    },
    Auth: {
      screen: AuthStack,
    },
    App: {
      screen: MainStack,
    },
  },
  {
    initialRouteName: 'Splash',
  },
);

export default createAppContainer(AppNavigator);

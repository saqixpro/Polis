import React from 'react';
import HomeStack from './HomeStack';
import NotificationStack from './NotificationStack';
import ChatStack from './ChatStack';
import ProfileStack from './ProfileStack';
import SearchStack from './SearchStack';
import Status from '../../Screens/Status';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';

const MainStack = createStackNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
    ChatStack: {
      screen: ChatStack,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
    NotificationStack: {
      screen: NotificationStack,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
    status: {
      screen: Status,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
    ProfileStack: {
      screen: ProfileStack,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
    SearchStack: {
      screen: SearchStack,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid,
      },
    },
  },
  {initialRouteName: 'Home'},
);

export default MainStack;

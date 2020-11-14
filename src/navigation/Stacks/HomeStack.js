import React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import Home from '../../Screens/Home';
import CommentScreen from '../../Screens/CommentScreen';
import MainComment from '../../Screens/MainComment';
import Questions from '../../Screens/Questions';

//AuthStack
const homeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid
      },

    },
    MainComment: {
      screen: MainComment,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid
      },

    },
    Questions: {
      screen: Questions,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid
      },
    },
    CommentScreen: {
      screen: CommentScreen,
      navigationOptions: {
        headerShown: false,
        ...TransitionPresets.FadeFromBottomAndroid
      },

    },
  },
  {initialRouteName: 'Home'},
);

export default homeStack;

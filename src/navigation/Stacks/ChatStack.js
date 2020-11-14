import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Messages from '../../Screens/Messages';
import ChatDetail from '../../Screens/ChatDetail';
const ChatStack = createStackNavigator(
  {
    ChatDetail: {
      screen: ChatDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
    Messages: {
      screen: Messages,
      navigationOptions: {
        headerShown: false,
      },
    },
  },

  {initialRouteName: 'Messages'},
);

export default ChatStack;

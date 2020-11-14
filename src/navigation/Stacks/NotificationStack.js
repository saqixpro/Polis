import React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';

import Notifications from '../../Screens/Notifications';

const NotificationStack = createStackNavigator({
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      headerShown: false,
      ...TransitionPresets.FadeFromBottomAndroid,
    },
  },
});

export default NotificationStack;

import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import Profile from '../../Screens/Profile';
import EditProfile from '../../Screens/EditProfile'
import ResetPassword from '../../Screens/ChangePassword'

//AuthStack
const profileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerShown: false,
      },
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        headerShown: false
      }
    },
    ResetPassword: {
      screen: ResetPassword,
      navigationOptions: {
        headerShown: false
      }
    },
  },
  {initialRouteName: 'Profile'},
);

export default profileStack;

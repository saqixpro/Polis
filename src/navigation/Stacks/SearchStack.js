import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
// import UpcomingTours from '../../Screens/UpcomingTours';
import Discover from '../../Screens/Discover';
//AuthStack
const SearchStack = createStackNavigator(
  {
    // UpcomingTours: {
    //   screen: UpcomingTours,
    //   navigationOptions: {
    //     headerShown: false,
    //   },
    // },
    Discover: {
      screen: Discover,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {initialRouteName: 'Discover'},
);

export default SearchStack;

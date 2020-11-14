import React from 'react';
import {ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import theme from '../theme';

const {height} = Dimensions.get('screen')

export const Loader = ({visible, style, size}) => (
  <ActivityIndicator
    animating
    color={theme.colors.primary}
    style={[visible ? loader.centering : loader.hideIndicator, style]}
    size={size ? size : "large"}
  />
);
const loader = StyleSheet.create({
  centering: {
    flex: 1,
    position: 'absolute',
    top: height / 1.8,
    left: 0,
    right: 0,
    zIndex: 1000000
  },
  hideIndicator: {
    position: 'absolute',
    top: height / 2,
    opacity: 0,
  },
});

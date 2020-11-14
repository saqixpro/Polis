import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const HeaderCenterComponent = ({name}) => {
  return (
    <View>
      <Text style={styles.textStyle}>{name}</Text>
    </View>
  );
};
export default HeaderCenterComponent;
export const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

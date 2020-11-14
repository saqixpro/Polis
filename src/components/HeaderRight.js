import React from 'react';
import {TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
// import {drawer} from '../assets';
import theme from '../theme';
import {Fonts} from '../utils/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderRight = ({name, icon, type, onPress, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.openDrawer();
      }}>
      {type === 'icon' ? (
        <AntDesign name="setting" size={24} color={'black'} />
      ) : (
        <Text style={styles.textStyle}>{name}</Text>
      )}
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontFamily: Fonts.RobotoBold,
    color: theme.colors.primaryDark,
  },
});
export default HeaderRight;

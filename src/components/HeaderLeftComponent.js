import React from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';
import {drawer, back} from '../aseets';

const HeaderLeftComponent = ({navigation, icon}) => {
  return (
    <View>
      {icon === 'back' ? (
        <TouchableWithoutFeedback
          activeOpacity={0}
          style={styles.drawerIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={back}
            resizeMode={'contain'}
            style={styles.drawerIcon}
          />
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          activeOpacity={0}
          style={styles.drawerIcon}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Image
            source={drawer}
            resizeMode={'contain'}
            style={styles.drawerIcon}
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default HeaderLeftComponent;

const styles = StyleSheet.create({
  drawerIcon: {
    height: 25,
    width: 25,
    tintColor: 'black',
  },
});

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get(`screen`);

const BottomTab = ({navigation}) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        hitSlop={Platform.OS == 'android' ? {top: 8, bottom: 8, left: 10, right: 10}: null}
        style={styles.button}>
        <Image
          source={require('../aseets/images/Category.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SearchStack')}
        hitSlop={Platform.OS == 'android' ? {top: 8, bottom: 8, left: 10, right: 10}: null}
        style={styles.button}>
        <Image
          source={require('../aseets/images/Search.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      <View style={styles.button} />
      <TouchableOpacity
        onPress={() => navigation.navigate('status')}
        style={{
          backgroundColor: '#000',
          width: 60,
          height: 60,
          borderRadius: 50,
          shadowColor: '#ccc',
          shadowOffset: {
            width: 3,
            height: 3,
          },
          shadowOpacity: 0.9,
          shadowRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: width / 2.4,
          top: -30,
        }}>
        <MaterialIcons name="add" color="#fff" size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('NotificationStack')}
        hitSlop={Platform.OS == 'android' ? {top: 8, bottom: 8, left: 10, right: 10}: null}
        style={styles.button}>
        <Image
          source={require('../aseets/images/bell.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatStack')}
        hitSlop={Platform.OS == 'android' ? {top: 8, bottom: 8, left: 10, right: 10}: null}
        style={styles.button}>
        <Image
          source={require('../aseets/images/dm.png')}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
      
    </View>
  ) 
};

export default BottomTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    width,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  button: {
    flex: 0.25,
    marginHorizontal: 25,
  }
});

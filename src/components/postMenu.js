import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PostMenu = ({
  style,
  newsPosts,
  verifiedPosts,
  allPosts,
  followingPosts,
}) => {
  return (
    <View style={[style, styles.mainContainer]}>
      <View>
        <View
          style={{
            marginLeft: -5,
            width: '100%',
            backgroundColor: '#fff',
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={allPosts}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.25,
            }}>
            <Image
              source={require('../aseets/images/all.png')}
              style={{
                transform: [
                  {
                    scale: 0.45,
                  },
                ],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={newsPosts}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.25,
            }}>
            <Image
              source={require('../aseets/images/news.png')}
              style={{
                transform: [
                  {
                    scale: 0.35,
                  },
                ],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={verifiedPosts}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.25,
            }}>
            <Image
              source={require('../aseets/images/verified.png')}
              style={{
                transform: [
                  {
                    scale: 0.45,
                  },
                ],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={followingPosts}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.25,
            }}>
            <Image
              source={require('../aseets/images/following.png')}
              style={{
                transform: [
                  {
                    scale: 0.4,
                  },
                ],
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostMenu;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#fff',
    height: 40,
    marginTop: -10,
  },
});

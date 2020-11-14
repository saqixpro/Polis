import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {Fonts} from '../../utils/Fonts';
import {ThemeConsumer} from 'react-native-elements';
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT,
    marginTop: -10
    // backgroundColor: 'white',
  },
  headerStyle: {
    backgroundColor: 'white',
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 2,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  inputStyle: {
    backgroundColor: 'white',
    borderBottomWidth: 1.5,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 5,
  },
  categoryContainer: {
    margin: 7,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    padding: 12,
  },

  categoryTitle: {
    fontSize: 16,
  },
  cardContainer: {
    flex: 1,
  },
  questionImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 5,
    marginVertical: '2%',
    borderRadius: 10,
  },
  cardViewContainer: {
    marginLeft: SCREEN_HEIGHT / 9,
    marginRight: SCREEN_HEIGHT / 9,
  },
  horizontalContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  verticalContainer: {
    margin: 10,
  },
  statusIcon: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
  },
  mediumText: {
    fontSize: 12,
    // color: 'white',
    alignSelf: 'center',
  },
  largeText: {
    fontSize: 14,
    width: '90%',
    color: 'white',
  },
  userImgStyle: {
    height: 50,
    width: 50,
    borderRadius: 50,
    // alignSelf: 'center',
    margin: 5,
    marginRight: 10,
  },
  text: {
    fontFamily: Fonts.FontAwesome,
    fontSize: 14,
    margin: 5,
    alignSelf: 'center',
  },
  mainimage: {
    height: 50,
    width: 50,
    borderRadius: 20,
    // alignSelf: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: 'orange',
  },
  filter: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.4,
  },
  cardimage: {
    height: 50,
    width: 50,
    borderRadius: 50,
    // alignSelf: 'center',
    margin: 10,
    marginTop: 55,
    // top: 15,
  },
  iconsStyle: {
    height: 18,
    width: 18,
  },
  bottomTabIcon: {
    height: 25,
    width: 25,
  },
  bottomContainer: {
    marginLeft: '4%',
    padding: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  cardStyle: {
    flex: 1,
    backgroundColor: 'white',
    // borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 10,
  },
  postContent: {
    width: '80%',
    alignSelf: 'center',
  }
});

export default styles;

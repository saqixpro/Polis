import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {Fonts} from '../../utils/Fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  imageBG: {
    flex: 0.4,
    backgroundColor: 'tomato',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    // borderBottomWidth: 0.5,
    borderTopWidth: 0,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  inputStyle: {
    width: '100%',
    backgroundColor: 'white',

    // borderColor: '#E8E8E8',
    borderRadius: 5,
    // alignSelf: 'center',
    elevation: 1,
    // marginVertical: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,

    borderBottomWidth: 1,
    borderColor: '#ccc',
    // borderRadius: 10,
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
    borderRadius: 10,
    marginVertical: 10,
  },
  cardViewContainer: {
    marginLeft: SCREEN_HEIGHT / 9,
    marginRight: SCREEN_HEIGHT / 9,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  verticalContainer: {
    margin: 10,
  },
  input: {
    backgroundColor: '#eaeaea',
    flex: 0.9,
    padding: 15,
    borderRadius: 10,
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
    alignSelf: 'center',
  },
  largeText: {
    fontSize: 16,
    color: theme.colors.primaryDark,
  },
  userImgStyle: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  postimage: {
    height: 30,
    width: 30,
    borderRadius: 15,
    flex: 0.1,
    marginHorizontal: 10,
  },
  bottomTabIcon: {
    height: 25,
    width: 25,
  },
  bottomContainer: {
    padding: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  cardStyle: {
    flex: 1,
    margin: 10,
  },
  horizontal: {
    flexDirection: 'row',
  },
});

export default styles;

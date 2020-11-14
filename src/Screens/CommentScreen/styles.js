import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {Fonts} from '../../utils/Fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    width: WIDTH / 1.23,
    height: SCREEN_HEIGHT / 5,
    borderRadius: 10,
    marginVertical: '2%',
  },
  cardViewContainer: {
    marginLeft: SCREEN_HEIGHT / 9,
    marginRight: SCREEN_HEIGHT / 9,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 40,
  },
  verticalContainer: {
    margin: 10,
  },
  input: {
    backgroundColor: '#ddd',
    flex: 1,
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
    width: "90%"
  },
  largeText: {
    fontSize: 16,

    color: theme.colors.primaryDark,
  },
  userImgStyle: {
    height: 50,
    width: 50,
    borderRadius: 70,
    margin: 5,
    alignSelf: 'flex-start',
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
    padding: 5,
    marginTop: 15,
    flexDirection: 'row',
  },
  cardStyle: {
    margin: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  horizontal: {
    flexDirection: 'row',
  },
  replying: {
    width: '90%',
    color: '#278ef5',
    alignSelf: 'center'
  }
});

export default styles;

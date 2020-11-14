import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
import {Fonts} from '../../utils/Fonts';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonStyle: {
    width: '80%',
    backgroundColor: theme.colors.primary,

    borderRadius: 5,

    elevation: 5,
    alignItems: 'center',
    // alignSelf: 'center',
    padding: 15,
    shadowColor: theme.colors.primary,

    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderBottomWidth: 1,
    borderColor: theme.colors.primary,
  },
  btn: {
    // marginTop: 10,
    // marginLeft:'5%',
    // marginRight:'10%',
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    width: '25%',
    fontFamily: 'geometriaBold',
    alignSelf: 'flex-end',
    textAlign: 'center',
    color: 'white',
    bottom: 5,
    marginRight: '5%',
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
    shadowColor: 'gray',

    shadowRadius: 1,
    shadowOpacity: 1.0,
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
    fontFamily: Fonts.GoogleSansMedium,
  },
  cardContainer: {
    flex: 1,
  },
  questionImage: {
    width: '100%',
    height: SCREEN_HEIGHT / 5,
    marginVertical: '2%',
  },
  cardViewContainer: {
    marginLeft: SCREEN_HEIGHT / 9,
    marginRight: SCREEN_HEIGHT / 9,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  verticalContainer: {
    margin: 10,
  },
  input: {
    width: '80%',
    backgroundColor: 'white',

    borderRadius: 5,
    elevation: 5,
    // alignItems: 'center',
    // alignSelf: 'center',
    padding: 25,
    shadowColor: theme.colors.primary,

    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderBottomWidth: 1,
    borderColor: theme.colors.primary,
  },
  statusIcon: {
    height: 18,
    width: 18,
    alignSelf: 'center',
    margin: 5,
    borderRadius: 5,
  },
  mediumText: {
    fontFamily: Fonts.RobotoRegular,
    fontSize: 14,
  },
  largeText: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 16,
    color: '#5BA5FF',
  },
  heading: {
    fontFamily: Fonts.RobotoMedium,
    fontSize: 16,
    color: theme.colors.gray,
    alignSelf: 'center',
  },
  userImgStyle: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    alignSelf: 'center',
    margin: 5,
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
    flex: 0.5,
    padding: 5,
    marginTop: 15,
    // justifyContent: 'center',
  },
  cardStyle: {
    // flex: 1,

    // padding: 15,
    width: 100,
    justifyContent: 'center',
    height: 100,
    backgroundColor: 'white',
    elevation: 10,
    shadowColor: '#BDBDBD',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    // borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: 10,
  },
});

export default styles;

import {Dimensions, StyleSheet} from 'react-native';
import theme from '../../theme';

const {width, height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  or: {
    // fontFamily: Fonts.RobotoRegular,
    color: '#d3d3d3',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 3,
    color: theme.colors.primary,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    // alignSelf: 'stretch',
    // textAlign: 'left',
    alignSelf: 'center',
    // fontFamily: Fonts.FontAwesome,
    // padding: 3,
    fontSize: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.primaryDark,
  },
  loginContainer: {
    width: '70%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 10,
    marginTop: 30,
    // fontFamily: Fonts.FontAwesome,
  },
  loginText: {
    color: theme.colors.lightGray,
    //  fontFamily: Fonts.FontAwesome,
    padding: 3,
  },
  placeholder: {
    // fontFamily: Fonts.RobotoRegular,
    color: 'red',
  },
  InputContainer: {
    width: width / 1.3,
    borderBottomColor: theme.colors.gray,
    borderBottomWidth: 1.5,
    marginVertical: 10,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: theme.colors.primaryDark,
  },
  facebookContainer: {
    width: '70%',

    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: theme.colors.primary,
    // fontFamily: Fonts.FontAwesome,
    padding: 4,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    width: width / 1.3,
    padding: 15,
    marginVertical: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  trans_button: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  infocus: {
    borderBottomColor: theme.colors.accent,
    borderBottomWidth: 2,
    backgroundColor: 'rgba(180,180,180,0.1)',
  },
});
export default styles;

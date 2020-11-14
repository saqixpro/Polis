import {StyleSheet, Dimensions, PixelRatio} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  scrollContainer: {
    justifyContent: 'center',
    padding: 15,
    flex: 1,
  },

  loading: {
    position: 'relative',
    flex: 0.01,
    alignSelf: 'center',
    top: 0,
    width: 20,
    height: 20,
  },

  btnText: {
    fontSize: 12,
  },
  infoText:{
    fontWeight: '600',
    fontSize: 13
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: 50,
    paddingBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  keyboardContainer: {
    ...Platform.select({
      ios: {
        flex: 1,
        backgroundColor: 'black',
      },
    }),
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 5,
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 0.5 / PixelRatio.get(),
    borderRadius: 18,
  },
  sendButton: {
    paddingRight: 15,
    paddingLeft: 15,
    alignSelf: 'center',
  },
  switch: {
    marginLeft: 15,
  },
  safeAreaSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeText: {
    fontSize: 16,
    fontWeight: '300',
  },
  mediumText: {
    fontSize: 13,
  },
  backArrow: {
    height: 25,
    width: 25,

    borderRadius: 50,
    marginLeft: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    paddingLeft: 10,
    borderRadius: 10,
    width: '80%',
  },
  fieldContainer: {
    paddingVertical: 5,
    flex: 0.8,
  },
  buttonStyle: {
    margin: 15,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
    width: '30%',

    alignItems: 'center',
  },
  cancl: {
    margin: 15,
    padding: 10,
    borderRadius: 30,
    width: '30%',

    alignItems: 'center',
  },
  cardimage: {
    height: 50,
    width: 50,
    borderRadius: 20,
    // alignSelf: 'center',
    margin: 10,
    // top: 15,
    borderWidth: 1,
    borderColor: 'orange',
  },
});
export default styles;

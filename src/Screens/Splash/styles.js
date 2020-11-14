import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  splashStyle: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  largeText: {
    fontSize: 16,

    color: theme.colors.prmaryDark,
  },
});
export default styles;

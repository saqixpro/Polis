const { StyleSheet, Dimensions } = require("react-native");
import theme from '../../theme';

const SCREEN_HEIGHT = Dimensions.get('window').height

const post_styles = StyleSheet.create({
    cardStyle: {
        flex: 1,
        backgroundColor: 'white',
        // borderWidth: 1,
        borderColor: theme.colors.lightGray,
        borderRadius: 10,
      },
      horizontalContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
      },
      postContent: {
        width: '80%',
        alignSelf: 'center',
      },
      questionImage: {
        width: '100%',
        height: SCREEN_HEIGHT / 5,
        marginVertical: '2%',
        borderRadius: 10,
      },
})

export default post_styles;
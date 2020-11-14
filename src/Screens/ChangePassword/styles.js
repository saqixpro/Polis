import {StyleSheet} from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '600'
    },

    saveButton: {
        backgroundColor: theme.colors.accent,
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 20
    },

    save_text: {
        fontWeight: 'bold',
        color: "#fff"
    },

    inputContainer: {
        marginVertical: 10
    },
    error: {
        alignSelf: 'center',
        marginVertical: 5,
        color: 'red',
        width: '90%'
    }
})

export default styles;
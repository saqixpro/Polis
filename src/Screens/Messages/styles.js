import { StyleSheet, Dimensions } from "react-native"
import theme from "../../theme"
import { Fonts } from "../../utils/Fonts"
const styles = StyleSheet.create({
	filter: {
		backgroundColor: theme.colors.lightGray,
		margin: 5,
		elevation: 5,
		padding: 7,
		fontFamily: Fonts.FontAwesome,
		fontSize: 16,
		borderRadius: 5,
		borderColor: theme.colors.primary,
		borderWidth: 1,
	},
	userImgStyle: {
		height: 50,
		width: 50,
		borderRadius: 20,
		// alignSelf: 'center',
		margin: 5,
	},
	searchContainer: {
		backgroundColor: "white",
	},
	inputStyle: {
		backgroundColor: "white",
		width: "98%",
		alignSelf: "center",
	},
	checkbox: { backgroundColor: "transparent", borderColor: "transparent" },
})
export default styles

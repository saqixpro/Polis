import { StyleSheet, Dimensions } from "react-native"
import theme from "../../theme"
import { Fonts } from "../../utils/Fonts"
import { ThemeConsumer } from "react-native-elements"
const SCREEN_HEIGHT = Dimensions.get("window").height

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: "white",
	},
	headerStyle: {
		backgroundColor: "white",
		borderBottomColor: theme.colors.lightGray,
		borderBottomWidth: 2,
	},
	iconStyle: {
		height: "100%",

		flex: 0.3,
		// alignSelf: 'center',
		// margin: 5,
	},
	smallButton: {
		padding: 5,
		backgroundColor: "white",
		margin: 5,
		borderRadius: 4,
		elevation: 5,
		shadowColor: "lightgray",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowRadius: 5,
		shadowOpacity: 1.0,
		// borderWidth: 1,
		borderColor: theme.colors.lightGray,
	},
	actionStyle: {
		padding: 5,

		margin: 5,
		borderRadius: 4,
	},
	searchContainer: {
		backgroundColor: "white",
		borderBottomWidth: 0,
		borderTopWidth: 0,
		width: "90%",
		alignSelf: "center",
		marginBottom: 10,
	},
	jobDetailStyle: {
		flex: 1,
		padding: 10,
	},
	inputStyle: {
		backgroundColor: "white",
		borderBottomWidth: 1.5,
		borderTopWidth: 1.5,
		borderLeftWidth: 1.5,
		borderRightWidth: 1.5,
		borderColor: "#E8E8E8",
		borderRadius: 5,
	},
	categoryContainer: {
		margin: 7,
		marginLeft: 10,
		justifyContent: "center",
		alignItems: "center",
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
		width: "100%",
		height: SCREEN_HEIGHT / 5,
		marginVertical: "2%",
	},
	cardViewContainer: {
		marginLeft: SCREEN_HEIGHT / 9,
		marginRight: SCREEN_HEIGHT / 9,
	},
	horizontalContainer: {
		flexDirection: "row",
	},
	verticalContainer: {
		margin: 10,
	},
	statusIcon: {
		height: 18,
		width: 18,
		alignSelf: "center",
		margin: 5,
		borderRadius: 5,
	},
	mediumText: {
		fontFamily: Fonts.RobotoRegular,
		fontSize: 12,
	},
	largeText: {
		fontFamily: Fonts.RobotoMedium,
		fontSize: 16,
		width: "87%",
		color: theme.colors.gray,
		marginLeft: 10,
	},
	userImgStyle: {
		height: 50,
		width: 50,
		borderRadius: 10,
		alignSelf: "center",
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
		marginTop: "5%",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	cardStyle: {
		flex: 1,
		flexDirection: "row",
		margin: 8,

		backgroundColor: "white",
		elevation: 10,
		shadowColor: "#BDBDBD",
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
})

export default styles

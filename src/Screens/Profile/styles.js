import { StyleSheet, Dimensions } from "react-native"
import theme from "../../theme"
const SCREEN_HEIGHT = Dimensions.get("window").height
const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: "white",
	},
	largeText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "black",
		marginTop: 10,
		// marginLeft: 15,
	},
	mainText: {
		marginLeft: 10,
		alignSelf: "center",
		fontSize: 16,
		color: "#555",
	},
	questionImage: {
		width: "100%",
		height: SCREEN_HEIGHT / 5,
		marginVertical: "2%",
		borderRadius: 10,
	},

	mainView: {
		flexDirection: "row",
		marginBottom: 20,
	},

	button: {
		flexDirection: "row",
		backgroundColor: "#eee",
		padding: 10,
		width: 120,
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		borderRadius: 8,
		shadowColor: "#ccc",
		shadowOffset: {
			width: 2,
			height: 2,
		},
		shadowOpacity: 0.7,
	},

	icon: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		padding: 5,
		width: 40,
		height: 40,
	},
	buttonStyle: {
		margin: 15,
		backgroundColor: "black",
		padding: 10,
		borderRadius: 20,
		width: "35%",
		alignSelf: "center",
	},
	userIcon: {
		borderRadius: 20,
		alignItems: "flex-end",
		height: 50,
		width: 50,
		marginLeft: 5,
	},
	blurView: {
		// backgroundColor: 'rgba(52, 52, 52, 0.5)',
		flexDirection: "row",
		marginTop: 15,
		justifyContent: "space-between",
	},
	cancl: {
		margin: 15,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
	},
	bottomContainer: {
		marginLeft: "4%",
		padding: 5,
		marginTop: 5,
		flexDirection: "row",
	},
	questionImage: {
		width: "100%",
		height: SCREEN_HEIGHT / 5,
		marginVertical: "2%",
	},
	userImgStyle: {
		height: 50,
		width: 50,
		borderRadius: 70,
		alignSelf: "center",
		margin: 5,
	},
	cardViewContainer: {
		marginLeft: SCREEN_HEIGHT / 9,
		marginRight: SCREEN_HEIGHT / 9,
	},
	horizontalContainer: {
		flexDirection: "row",
	},
	bottomTabIcon: {
		height: 25,
		width: 25,
	},
	categoryTitle: {
		fontSize: 16,
		// fontFamily: Fonts.GoogleSansMedium,
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

	searchContainer: {
		backgroundColor: "transparent",
		borderBottomWidth: 0,
		borderTopWidth: 0,
		width: "100%",
		borderColor: theme.colors.primary,
		borderWidth: 0.2,
	},
	inputStyle: {
		backgroundColor: "white",
		borderBottomWidth: 1.5,
		borderTopWidth: 1.5,
		borderLeftWidth: 1.5,
		borderRightWidth: 1.5,
		borderColor: "transparent",
		borderRadius: 5,
		borderColor: theme.colors.primary,
		borderWidth: 0.2,
	},
	mediumText: {
		fontSize: 12,
	},
	buttonstyle: {
		borderRadius: 10,
		// margin: 10
		padding: 3,
		backgroundColor: "skyblue",
	},

	cardStyle: {
		flex: 1,
		margin: 10,
		padding: 15,
		backgroundColor: "white",
		elevation: 10,
		shadowColor: "#BDBDBD",
		shadowOffset: {
			width: 0,
			height: 1,
		},
	},
	actionBtn: {
		padding: 15,
		backgroundColor: "#fff",
		marginTop: 20,
		marginBottom: 10,
		shadowColor: "#ccc",
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.9,
		shadowRadius: 5,
		borderRadius: 10,
		paddingHorizontal: 20,
		transform: [
			{
				scale: 0.9,
			},
		],
	},
})
export default styles

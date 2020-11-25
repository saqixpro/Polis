import { StyleSheet, Dimensions } from "react-native"
import theme from "../../theme"
import { Fonts } from "../../utils/Fonts"

const { width, height } = Dimensions.get("screen")

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		alignItems: "center",
	},
	container: {
		flex: 1,
		alignItems: "center",
	},
	image: {
		width: width / 1.1,
		height: 200,
	},
	bottomContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 40,
	},
	header: {},
	body: {},
	content: {
		width: "90%",
		alignSelf: "center",
		marginVertical: 15,
	},
	textContent: {
		fontSize: 15,
		fontWeight: "600",
	},
	url: {
		color: theme.colors.gray,
		marginVertical: 10,
	},
	actionBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: "10%",
	},

	actionButton: {
		flexDirection: "row",
		padding: 10,
	},

	btnContent: {
		padding: 3,
	},
	inputView: {
		flexDirection: "row",
		marginHorizontal: 20,
		backgroundColor: "#ccc",
		justifyContent: "center",
		paddingHorizontal: 10,
		borderRadius: 10,
	},
	input: {
		width: "90%",
		padding: 5,
	},
})

export default styles

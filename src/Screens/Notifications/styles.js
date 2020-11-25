import { Dimensions, StyleSheet } from "react-native"

const { width, height } = Dimensions.get("screen")

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: width / 1.05,
		flexDirection: "row",
		backgroundColor: "#fff",
		padding: 10,
		marginVertical: 2,
		borderRadius: 10,
		padding: 20,
	},
	type: {
		flex: 0.2,
		justifyContent: "center",
	},
	heading: {
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 20,
	},
	type_image: {
		width: 20,
		height: 20,
	},
	content: {
		flex: 1,
		justifyContent: "space-between",
		flexDirection: "row",
	},
	avatar: {
		width: 40,
		height: 40,
		marginVertical: 5,
		borderRadius: 50,
	},
	timeStamp: {
		textAlign: "right",
		fontSize: 13,
		color: "#8F92A1",
	},
})

export default styles

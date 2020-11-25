import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	Animated,
	Easing,
	Image,
	SafeAreaView,
	Alert,
} from "react-native"
import styles from "./styles"
import BottomTab from "../../components/bottomTab"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import Swipable from "react-native-gesture-handler/Swipeable"
import { FontAwesome5 } from "@expo/vector-icons"
import firebase from "firebase"
import { connect } from "react-redux"

const formatTime = (timeStamp) => {
	const timeInSeconds =
		(new Date().getTime() - new Date(timeStamp).getTime()) / 1000
	if (timeInSeconds < 60) return `${timeInSeconds.toFixed(0)} s`
	const timeInMinutes = timeInSeconds / 60
	if (timeInMinutes < 60) return `${timeInMinutes.toFixed(0)} m`
	const timeInHours = timeInMinutes / 60
	if (timeInHours < 24) return `${timeInHours.toFixed(0)} h`
	const timeInDays = timeInHours / 24
	if (timeInDays < 30) return `${timeInDays.toFixed(0)} d`
	const timeInMonths = timeInDays / 30
	if (timeInMonths < 12) return `${timeInMonths.toFixed(0)} months`
	return `${(timeInMonths / 12).toFixed(0)} y`
}

const RenderCards = ({
	id,
	type,
	postID,
	navigation,
	time,
	textContent,
	senderID,
	receiverID,
	ondelete,
}) => {
	const leftSwipe = (progress, dragX) => {
		const scale = dragX.interpolate({
			inputRange: [0, 100],
			outputRange: [0.5, 0],
		})

		return (
			<View
				style={{
					width: 100,
					marginVertical: 10,
					backgroundColor: "red",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Animated.Text
					style={{
						transform: [{ scale: scale }],
						color: "white",
						fontWeight: "bold",
					}}
				>
					Delete
				</Animated.Text>
			</View>
		)
	}

	const handleNavigation = () => {
		if (type == "comment" || type == "like") {
			navigation.navigate("CommentScreen", { postID })
		} else if (type == "message") {
			navigation.navigate("ChatDetail", {
				senderID,
				receiverID,
			})
		}
	}

	return (
		<Swipable renderRightActions={leftSwipe} onSwipeableRightOpen={ondelete}>
			<TouchableOpacity onPress={handleNavigation} style={styles.card}>
				<View style={styles.type}>
					<FontAwesome5
						name={type == "like" ? "heart" : "comment-alt"}
						size={20}
					/>
				</View>
				<View style={styles.content}>
					<Text>{textContent}</Text>
					<Text style={styles.timeStamp}>{formatTime(time)}</Text>
				</View>
			</TouchableOpacity>
		</Swipable>
	)
}

const Notifications = (props) => {
	const [alignment] = useState(new Animated.Value(0))
	const [notifications, setNotifications] = useState([])

	const handleDelete = (id) => {
		const _updatedNotifications = notifications.filter((item) => item.id !== id)
		setNotifications(_updatedNotifications)

		firebase.firestore().collection("Notifications").doc(id).delete()
	}

	useEffect(() => {
		fetchNotifications()
	}, [])

	const fetchNotifications = async () => {
		try {
			let noti = await firebase
				.firestore()
				.collection("Notifications")
				.where("user", "==", props.user.uid)
				.get()
			noti = noti.docs.map((item) => ({ id: item.id, ...item.data() }))
			setNotifications(noti)
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	const animateBottomTabs = (val) =>
		Animated.timing(alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

	const bottomTabInteropolate = alignment.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 100],
	})

	const bottomTabDynamicStyle = {
		transform: [
			{
				translateY: bottomTabInteropolate,
			},
		],
	}

	return (
		<View style={{ flex: 1 }}>
			<SafeAreaView />
			<View style={styles.container}>
				<Text style={styles.heading}>Notifications</Text>
				<FlatList
					data={notifications}
					showsVerticalScrollIndicator={false}
					onScrollBeginDrag={() => animateBottomTabs(1)}
					onScrollEndDrag={() => animateBottomTabs(0)}
					renderItem={({ item }) => (
						<RenderCards
							id={item.id}
							postID={item.postID}
							navigation={props.navigation}
							textContent={item.textContent}
							time={item.timeStamp}
							senderID={item.senderID}
							receiverID={item.receiverID}
							type={item.type}
							ondelete={() => handleDelete(item.id)}
						/>
					)}
				/>
			</View>
			<View
				style={{
					width: "100%",
					backgroundColor: "#fff",
					height: 70,
					zIndex: 10000,
				}}
			>
				<Animated.View style={[bottomTabDynamicStyle]}>
					<BottomTab navigation={props.navigation} />
				</Animated.View>
			</View>
		</View>
	)
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(Notifications)

import React, { useState } from "react"
import { View, Text, Animated, Easing, Image, SafeAreaView } from "react-native"
import styles from "./styles"
import BottomTab from "../../components/bottomTab"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"
import Swipable from "react-native-gesture-handler/Swipeable"
import { FontAwesome5 } from "@expo/vector-icons"

const RenderCards = ({ id, type, user, avatar, time, content, ondelete }) => {
	const leftSwipe = (progress, dragX) => {
		const scale = dragX.interpolate({
			inputRange: [0, 100],
			outputRange: [0.5, 0],
		})

		return (
			<View
				style={{
					width: 100,
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

	return (
		<Swipable renderRightActions={leftSwipe} onSwipeableRightOpen={ondelete}>
			<TouchableOpacity
				disabled
				onPress={() => alert(`You will be redirected to the post of id ${id} `)}
				style={styles.card}
			>
				<View style={styles.type}>
					<FontAwesome5
						name={type == "like" ? "heart" : "comment-alt"}
						size={20}
					/>
				</View>
				<View style={styles.content}>
					<Image
						source={require("../../aseets/images/user.jpg")}
						style={styles.avatar}
					/>
					{type == "like" ? (
						<Text>{user} liked your post</Text>
					) : type == "comment" ? (
						<Text> {user} commented on your post</Text>
					) : null}
					<Text style={styles.timeStamp}>{time}</Text>
				</View>
			</TouchableOpacity>
		</Swipable>
	)
}

const Notifications = (props) => {
	const [alignment] = useState(new Animated.Value(0))
	const [notifications, setNotifications] = useState([
		{
			id: 0,
			type: "like",
			user: "John Wick",
			avatar: "../../aseets/images/user.jpg",
			time: `Today ${new Date().getHours()}:${new Date().getMinutes()}`,
			content: ``,
		},
		{
			id: 1,
			type: "comment",
			user: "John Wick",
			avatar: "../../aseets/images/user.jpg",
			time: `Today ${new Date().getHours()}:${new Date().getMinutes()}`,
			content: `Nice Content! Highly appreciated`,
		},
		{
			id: 3,
			type: "comment",
			user: "Simon Jones",
			avatar: "../../aseets/images/user.jpg",
			time: `Today ${new Date().getHours()}:${new Date().getMinutes()}`,
			content: `Such an Amazing Adventure it was! ✌️`,
		},
		{
			id: 4,
			type: "like",
			user: "Brad",
			avatar: "../../aseets/images/user.jpg",
			time: `Today ${new Date().getHours()}:${new Date().getMinutes()}`,
			content: ``,
		},
	])

	const handleDelete = (id) => {
		const _updatedNotifications = notifications.filter((item) => item.id !== id)
		setNotifications(_updatedNotifications)
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
					extraData={notifications}
					showsVerticalScrollIndicator={false}
					onScrollBeginDrag={() => animateBottomTabs(1)}
					onScrollEndDrag={() => animateBottomTabs(0)}
					renderItem={({ item }) => (
						<RenderCards
							id={item.id}
							user={item.user}
							avatar={item.avatar}
							type={item.type}
							content={item.content}
							time={item.time}
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

export default Notifications

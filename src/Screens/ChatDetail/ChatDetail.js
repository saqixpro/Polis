import React, { Component } from "react"
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	SafeAreaView,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	Image,
	Animated,
	Easing,
	KeyboardAvoidingView,
	Alert,
} from "react-native"
import theme from "../../theme"
import Moment from "moment"
import { Fonts } from "../../utils/Fonts"
import BottomTab from "../../components/bottomTab"
import Functions from "../../functions/functions"
import firebase from "firebase"
import { connect } from "react-redux"
import { MaterialIcons } from "@expo/vector-icons"
import * as Notifications from "../../functions/notifications"

class ChatDetail extends Component {
	constructor(props) {
		super(props)
		this.list = null
		this.state = {
			message: "",
			sending: false,
			receiver: null,
			alignment: new Animated.Value(0),
			email: "",
			sender: null,
			conversation: [],
		}
	}

	animateBottomTabs = (val) =>
		Animated.timing(this.state.alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

	componentDidMount = async () => {
		const receiverID = this.props.navigation.getParam("receiverID")
		await this.fetchUsers(receiverID)
		// this.fetchPreviousMessages()
		this.fetchMessagesInRealTime()
	}

	sendMessage = async () => {
		const { message, receiver } = this.state

		const sender = this.props.user

		if (message !== "") {
			const data = {
				message,
				senderID: sender.uid,
				timeStamp: Date.now(),
			}

			const channelID =
				sender.uid > receiver.id
					? `${sender.uid}_${receiver.id}`
					: `${receiver.id}_${sender.uid}`

			// Save Chats in Real Time Database

			const ref = firebase.database().ref("chats").child(channelID)

			ref.push(data, (err) => {
				if (err) {
					Alert.alert(`Error`, err.message)
				}
			})
		}

		Notifications.sendExpoNotification(receiver.pushToken, sender.name, message)

		await firebase
			.database()
			.ref("notifications/")
			.child(receiver.id)
			.push({ sender: sender.name, message, timeStamp: Date.now() })
	}

	fetchMessagesInRealTime = () => {
		const { receiver } = this.state
		const sender = this.props.user
		try {
			const channelID =
				sender.uid > receiver.id
					? `${sender.uid}_${receiver.id}`
					: `${receiver.id}_${sender.uid}`
			const ref = firebase.database().ref("chats").child(channelID)
			ref.on("child_added", (snapshot) => {
				this.setState({
					conversation: [...this.state.conversation, snapshot.val()],
				})
			})
		} catch (err) {
			console.log(err.message)
		}
	}

	fetchUsers = async (receiverID) => {
		try {
			const sender = this.props.user
			query = await Functions.fetchUserById(receiverID)
			const receiver = query.user
			this.setState({ sender, receiver })
		} catch (error) {
			console.log(error.message)
		}
	}

	renderItem = ({ item, index }) => {
		return (
			<View
				style={{
					flex: 1,
					marginVertical: 8,
					width: "95%",
					alignSelf:
						item.senderID == this.props.user.uid ? "flex-start" : "flex-end",
				}}
				key={index}
			>
				<View
					style={{
						flexDirection:
							item.senderID == this.props.user.uid ? "row" : "row-reverse",
					}}
				>
					{item.senderID == this.props.user.uid ? (
						this.props.user.avatar ? (
							<Image
								source={{ uri: this.props.user.avatar }}
								style={{
									height: 50,
									alignSelf: "center",
									width: 50,
									borderRadius: 20,
									justifyContent: "space-around",
								}}
							/>
						) : (
							<View
								style={{
									height: 50,
									backgroundColor: "#fff",
									width: 50,
									borderRadius: 20,
									justifyContent: "space-around",
									alignItems: "center",
									alignSelf: "center",
									shadowColor: "#aaa",
									shadowOffset: {
										width: 3,
										height: 3,
									},
									shadowOpacity: 0.9,
									shadowRadius: 3.5,
								}}
							>
								<Text style={{ fontSize: 26, fontWeight: "bold" }}>
									{this.props.user.name
										? this.props.user.name.charAt(0).toUpperCase()
										: "S"}
								</Text>
							</View>
						)
					) : this.state.receiver.avatar ? (
						<Image
							source={{ uri: this.state.receiver.avatar }}
							style={{
								height: 50,
								alignSelf: "center",
								backgroundColor: "blue",
								width: 50,
								borderRadius: 20,
								justifyContent: "space-around",
							}}
						/>
					) : (
						<View
							style={{
								height: 50,
								backgroundColor: "#fff",
								width: 50,
								borderRadius: 20,
								justifyContent: "space-around",
								alignItems: "center",
								shadowColor: "#aaa",
								shadowOffset: {
									width: 3,
									height: 3,
								},
								shadowOpacity: 0.9,
								shadowRadius: 3.5,
							}}
						>
							<Text style={{ fontSize: 26, fontWeight: "bold" }}>
								{this.state.receiver.name
									? this.state.receiver.name.charAt(0).toUpperCase()
									: "S"}
							</Text>
						</View>
					)}
					<View
						style={
							(styles.messageContainer,
							{
								marginHorizontal: 10,
								borderColor: "white",
								borderWidth: 1,
								marginTop: 5,
								borderRadius: 10,
								width: "85%",
								alignSelf:
									item.senderID == this.props.user.uid
										? "flex-start"
										: "flex-end",
								backgroundColor:
									item.senderID == this.props.user.uid ? "#fff" : "#fff",
								shadowOffset: {
									width: 3,
									height: 3,
								},
								shadowColor: "#ccc",
								shadowOpacity: 0.9,
							})
						}
					>
						<View style={{ padding: 10 }}>
							<Text
								style={{
									alignSelf:
										item.senderID !== this.props.user.uid
											? "flex-start"
											: "flex-end",
									color: "#000",
									width: "100%",
									// fontFamily: Fonts.FontAwesome,
								}}
							>
								{item.message}
							</Text>
						</View>
					</View>
				</View>
				<Text
					style={{
						alignSelf:
							item.senderID !== this.props.user.uid ? "flex-end" : "flex-start",
						color: "grey",
						fontSize: 12,
						marginHorizontal: 50,
						marginVertical: 8,
					}}
				>
					{"  "}
					{item.senderID == this.props.user.uid
						? this.props.user.name
						: this.state.receiver.name}{" "}
					{"  "}
					{Moment(item.date).format("LT")}
				</Text>
			</View>
		)
	}

	render() {
		const bottomTabInteropolate = this.state.alignment.interpolate({
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

		const { message } = this.state
		return this.state.receiver ? (
			<View style={{ flex: 1, backgroundColor: "#fff" }}>
				<SafeAreaView />
				{this.state.receiver.avatar ? (
					<Image
						source={{ uri: this.state.receiver.avatar }}
						style={{
							height: 45,
							alignSelf: "center",
							backgroundColor: "blue",
							width: 45,
							borderRadius: 20,
							justifyContent: "space-around",
							marginRight: 10,
						}}
					/>
				) : (
					<View
						style={{
							height: 45,
							backgroundColor: "#fff",
							width: 45,
							borderRadius: 20,
							justifyContent: "space-around",
							alignItems: "center",
							shadowColor: "#aaa",
							alignSelf: "center",
							shadowOffset: {
								width: 3,
								height: 3,
							},
							shadowOpacity: 0.9,
							shadowRadius: 3.5,
							marginHorizontal: 10,
						}}
					>
						<Text style={{ fontSize: 26, fontWeight: "bold" }}>
							{this.state.receiver.name
								? this.state.receiver.name.charAt(0).toUpperCase()
								: "S"}
						</Text>
					</View>
				)}
				<Text
					style={{
						alignSelf: "center",
						marginTop: 10,
						color: "black",
						fontSize: 18,
						// fontFamily: Fonts.FontAwesome,
					}}
				>
					{this.state.receiver ? this.state.receiver.name : null}
				</Text>

				<FlatList
					ref={(ref) => {
						this.list = ref
					}}
					onContentSizeChange={() => this.list.scrollToEnd({ animated: true })}
					style={{
						marginTop: 10,
						marginLeft: 7,
						marginRight: 7,
						padding: 15,
						backgroundColor: "#faf8f7",
						flex: 1,
					}}
					data={this.state.conversation}
					showsVerticalScrollIndicator={false}
					extraData={this.state}
					renderItem={this.renderItem}
					onScrollBeginDrag={(e) => {
						this.animateBottomTabs(1)
					}}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
					extraData={this.state}
					keyExtractor={(item, index) => {
						item + index.toString()
					}}
				/>

				<KeyboardAvoidingView
					behavior='padding'
					keyboardVerticalOffset={10}
					style={{
						marginVertical: "10%",
						flexDirection: "row",
					}}
				>
					{this.state.receiver.avatar ? (
						<Image
							source={{ uri: this.state.receiver.avatar }}
							style={{
								height: 40,
								alignSelf: "center",
								backgroundColor: "blue",
								width: 40,
								borderRadius: 20,
								justifyContent: "space-around",
								marginRight: 10,
							}}
						/>
					) : (
						<View
							style={{
								height: 40,
								backgroundColor: "#fff",
								width: 40,
								borderRadius: 20,
								justifyContent: "space-around",
								alignItems: "center",
								shadowColor: "#aaa",
								alignSelf: "center",
								shadowOffset: {
									width: 3,
									height: 3,
								},
								shadowOpacity: 0.9,
								shadowRadius: 3.5,
								marginHorizontal: 10,
							}}
						>
							<Text style={{ fontSize: 23, fontWeight: "bold" }}>
								{this.state.receiver.name
									? this.state.receiver.name.charAt(0).toUpperCase()
									: "S"}
							</Text>
						</View>
					)}
					<View
						style={{
							width: "80%",
							flexDirection: "row",
							backgroundColor: "#ccc",
							borderRadius: 8,
						}}
					>
						<TextInput
							style={{
								padding: 15,
								width: "80%",
							}}
							placeholder={"Write Something Here..."}
							placeholderTextColor='#555'
							onChangeText={(text) => this.setState({ message: text })}
						/>
						<TouchableOpacity
							onPress={this.sendMessage}
							activeOpacity={0.7}
							disabled={message === "" ? true : false}
							style={{
								width: "20%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{this.state.sending ? (
								<ActivityIndicator animating color={"tomato"} />
							) : (
								<MaterialIcons name='send' size={24} />
							)}
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
				<View
					style={{
						width: "100%",
						backgroundColor: "#fff",
						height: 70,
						zIndex: 10000,
					}}
				>
					<Animated.View style={[bottomTabDynamicStyle]}>
						<BottomTab navigation={this.props.navigation} />
					</Animated.View>
				</View>
			</View>
		) : (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Loading...</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	messageContainer: {
		margin: 10,
		padding: 5,
		flexWrap: "wrap",
	},
})

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(ChatDetail)

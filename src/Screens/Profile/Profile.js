import React, { Component } from "react"
import {
	View,
	Text,
	Image,
	SafeAreaView,
	Animated,
	Easing,
	Dimensions,
	Share,
	Linking,
} from "react-native"
import styles from "./styles"
import {
	FlatList,
	TouchableOpacity,
	ScrollView,
} from "react-native-gesture-handler"
import theme from "../../theme"
import OptionsMenu from "react-native-options-menu"
import Slider from "react-native-slider"
import BottomTab from "../../components/bottomTab"
import { connect } from "react-redux"
import firebase from "firebase"
import { ProfileSkeleton } from "../../components/skeletons"
import Functions from "../../functions/functions"
const { width, height } = Dimensions.get("screen")
import * as ActionTypes from "../../redux/reducers/actionTypes"
import post_styles from "./postStyle"
import {
	FontAwesome5,
	MaterialIcons,
	Entypo,
	Feather,
	Ionicons,
	FontAwesome,
} from "@expo/vector-icons"

class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			showSearch: false,
			alignment: new Animated.Value(0),
			search: "",
			user: {},
			value: 1,
			posts: [],
			replies: [],
		}
	}

	componentDidMount = async () => {
		const uid = this.props.navigation.state.params.uid
		if (uid == this.props.user.uid)
			await this.setState({ user: this.props.user })
		else await this.fetchCurrentUser(uid)

		this.fetchPostsByCurrentUser()
		this.updateFollowers()
	}

	updateFollowers = async () => {
		const followers = await Functions.getFollowers(this.state.user.uid)
		this.setState({ user: { ...this.state.user, followers } })
	}

	fetchCurrentUser = (id) => {
		return new Promise(async (resolve) => {
			this.setState({ loading: true })
			const currentUser = await firebase
				.firestore()
				.collection("users")
				.doc(id)
				.get()

			console.log(JSON.stringify(currentUser.data()))

			this.setState({ user: currentUser.data(), loading: false })
			resolve(true)
		})
	}

	signOut = () => {
		firebase.auth().signOut()
	}

	fetchPostsByCurrentUser = async () => {
		const { posts } = await Functions.fetchPostsByUser(this.state.user.uid)
		this.setState({ posts })
	}

	formatTime = (timeStamp) => {
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

	liked = (_id) => {
		const { posts } = this.state
		const post = posts.find((_post) => _post.id == _id)
		let alreadyLiked = false
		if (post) {
			alreadyLiked = post.likes.find((id) => id == this.props.user.uid)
		}
		return alreadyLiked
	}

	renderPosts = (item, index) => {
		return (
			<TouchableOpacity
				key={index}
				activeOpacity={0.9}
				style={{ ...post_styles.cardStyle, width, marginTop: 10 }}
			>
				<View
					style={[
						post_styles.horizontalContainer,
						{ width: "90%", alignSelf: "center" },
					]}
				>
					{this.state.user.avatar ? (
						<Image
							source={{ uri: this.state.user.avatar }}
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
								{this.state.user.name
									? this.state.user.name.charAt(0).toUpperCase()
									: "S"}
							</Text>
						</View>
					)}
					<View
						style={{
							// justifyContent: 'space-around',
							flexDirection: "row",
							alignSelf: "center",
							// backgroundColor: 'black',
							width: "70%",
						}}
					>
						<TouchableOpacity style={{ width: "100%" }}>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={[{ color: theme.colors.primary, fontWeight: "300" }]}
								>
									{this.state.user.name}
								</Text>
								{this.state.user.verifiedAccount ? (
									<FontAwesome
										style={{ marginHorizontal: 5 }}
										name='check-circle'
										size={16}
									/>
								) : null}
							</View>
							<Text style={{ color: theme.colors.primary, fontWeight: "300" }}>
								{this.state.user.username}
							</Text>
						</TouchableOpacity>
						<Text
							style={[
								{
									fontSize: 12,
									color: "#8F92A1",
								},
							]}
						>{`${this.formatTime(item.timeStamp)} ago`}</Text>
					</View>
				</View>
				<View style={post_styles.postContent}>
					{item.image ? (
						<Image
							style={post_styles.questionImage}
							resizeMode={"cover"}
							source={{ uri: item.image }}
						/>
					) : null}

					<Text style={{ marginVertical: 15, fontWeight: "500" }}>
						{item.textContent}
					</Text>
					{item.type == "news" ? (
						<TouchableOpacity onPress={() => Linking.openURL(item.url)}>
							<Text style={{ color: "#8F92A1" }}>{item.url}</Text>
						</TouchableOpacity>
					) : null}
				</View>

				<View
					style={[
						styles.horizontalContainer,
						{
							justifyContent: "space-between",
							width: "90%",
							alignSelf: "center",
						},
					]}
				>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("CommentScreen")}
					>
						<View style={[styles.bottomContainer]}>
							<FontAwesome5 name='comment-alt' size={18} color='gray' />
							<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
								{item.comments ? item.comments.length : 0}
							</Text>
						</View>
					</TouchableOpacity>
					{item.type == "news" ? (
						<TouchableOpacity
							onPress={() => {
								Share.share({
									url: item.url,
									title: item.author.name,
									message: item.textContent,
								})
							}}
							style={{
								justifyContent: "center",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Text>Share</Text>
							<FontAwesome
								style={{ marginHorizontal: 5 }}
								name='share'
								size={14}
							/>
						</TouchableOpacity>
					) : null}
					<View style={[styles.bottomContainer]}>
						{this.liked(item.id) ? (
							<TouchableOpacity onPress={() => this.unlikePost(item.id)}>
								<FontAwesome name='heart' size={20} color='red' />
							</TouchableOpacity>
						) : (
							<TouchableOpacity onPress={() => this.likePost(item.id)}>
								<FontAwesome name='heart-o' size={20} color='grey' />
							</TouchableOpacity>
						)}
						<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
							{item.likes ? item.likes.length : 0}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	animateBottomTabs = (val) =>
		Animated.timing(this.state.alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

	followUser = async () => {
		await Functions.followUser(this.props.user.uid, this.state.user.uid)
		this.props._followUser(this.state.user.uid)
		this.updateFollowers()
	}

	unfollowUser = async () => {
		await Functions.unfollowUser(this.props.user.uid, this.state.user.uid)
		this.props._unfollowUser(this.state.user.uid)
		this.updateFollowers()
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

		return this.state.loading ? (
			<View style={{ flex: 1, padding: 20 }}>
				<SafeAreaView />
				<ProfileSkeleton />
			</View>
		) : (
			<View style={styles.mainContainer}>
				<ScrollView
					onScrollBeginDrag={() => this.animateBottomTabs(1)}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
					showsVerticalScrollIndicator={false}
					style={styles.mainContainer}
				>
					<SafeAreaView />
					{this.state.showSearch ? (
						<View style={{ height: "100%", width: "100%", padding: 10 }}>
							<View style={styles.blurView}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										alignSelf: "center",
									}}
								>
									<TouchableOpacity
										style={{
											backgroundColor: "#000",
											width: 50,
											height: 50,
											alignItems: "center",
											justifyContent: "center",
											borderRadius: 10,
											marginHorizontal: 10,
										}}
										onPress={() => {
											this.setState({ showSearch: false })
										}}
									>
										<Entypo name='chevron-left' size={18} color={"white"} />
									</TouchableOpacity>
									{this.props.user.avatar ? (
										<Image
											source={{ uri: this.state.user.avatar }}
											style={{
												height: 50,
												width: 50,
												borderRadius: 10,
												marginLeft: 20,
												justifyContent: "space-around",
											}}
										/>
									) : (
										<View
											style={{
												height: 50,
												alignSelf: "center",
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
											<Text style={{ fontSize: 30, fontWeight: "bold" }}>
												{this.props.user.name
													? this.props.user.name.charAt(0).toUpperCase()
													: null}
											</Text>
										</View>
									)}
									<View style={{ paddingLeft: 15 }}>
										<Text
											style={{
												color: "black",
												fontWeight: "bold",
												fontSize: 16,
											}}
										>
											{this.state.user ? this.state.user.name : "xxxxxx"}
										</Text>
										<Text
											style={{
												color: "black",
												fontSize: 12,
											}}
										>
											online
										</Text>
									</View>
								</View>
								<OptionsMenu
									button={require("../../aseets/images/more.png")}
									buttonStyle={{
										width: 30,
										height: 20,
										resizeMode: "contain",
										marginTop: 7,
									}}
									destructiveIndex={0}
									options={["Report", "Delete", "Cancel"]}
									actions={[
										() => {
											alert("Reported")
										},
										() => {
											alert("Deleted")
										},
										() => {},
									]}
								/>
							</View>
							<Text style={[styles.largeText, { marginTop: 40 }]}>
								Settings
							</Text>
							<View style={{ top: 30 }}>
								<TouchableOpacity
									onPress={() => this.props.navigation.navigate("EditProfile")}
									style={styles.mainView}
								>
									<View style={styles.icon}>
										<Feather name='user' size={28} color='#555' />
									</View>
									<Text style={styles.mainText}>Edit Profile</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() =>
										this.props.navigation.navigate("ResetPassword")
									}
									style={styles.mainView}
								>
									<View style={styles.icon}>
										<FontAwesome name='lock' size={28} color='#555' />
									</View>
									<Text style={[styles.mainText, { marginLeft: 19 }]}>
										Reset Password
									</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.mainView}>
									<View style={styles.icon}>
										<FontAwesome5
											name='clipboard-list'
											size={28}
											color='grey'
										/>
									</View>
									<Text style={styles.mainText}>Terms & Conditions</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.mainView}>
									<View style={styles.icon}>
										<FontAwesome name='user-o' size={28} color='grey' />
									</View>
									<Text style={styles.mainText}>Privacy Policy</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={this.signOut}
									style={styles.mainView}
								>
									<View style={styles.icon}>
										<FontAwesome name='sign-out' size={28} color='grey' />
									</View>
									<Text style={styles.mainText}>Logout</Text>
								</TouchableOpacity>
							</View>
						</View>
					) : (
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginTop: 10,
								padding: 5,
							}}
						>
							<TouchableOpacity
								style={{
									marginLeft: 10,
									backgroundColor: "#000",
									width: 40,
									height: 40,
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 10,
								}}
								onPress={() => {
									this.props.navigation.navigate("Home")
								}}
							>
								<Entypo name='chevron-left' size={24} color={"white"} />
							</TouchableOpacity>
							{this.state.user.uid == this.props.user.uid ? (
								<TouchableOpacity
									style={{
										marginRight: 10,
										padding: 5,
										paddingHorizontal: 10,
										borderRadius: 10,
										alignItems: "center",
										justifyContent: "center",
										borderColor: "#000",
										borderWidth: 2,
									}}
									onPress={() => {
										this.setState({ showSearch: true })
									}}
								>
									<FontAwesome5 name='globe' size={25} color={"black"} />
								</TouchableOpacity>
							) : (
								<OptionsMenu
									button={require("../../aseets/images/dropdown.png")}
									buttonStyle={{
										width: 40,
										height: 40,
										borderRadius: 8,
										marginTop: 7,
									}}
									destructiveIndex={0}
									options={["Report", "Cancel"]}
									actions={[
										() => {
											alert("Reported")
										},
										() => {},
									]}
								/>
							)}
						</View>
					)}
					<View>
						{this.state.user.avatar ? (
							<Image
								source={{ uri: this.state.user.avatar }}
								style={{
									height: 70,
									alignSelf: "center",
									backgroundColor: "blue",
									width: 70,
									borderRadius: 20,
									justifyContent: "space-around",
									marginBottom: 15,
								}}
							/>
						) : (
							<View
								style={{
									height: 70,
									alignSelf: "center",
									backgroundColor: "#fff",
									width: 70,
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
									marginBottom: 15,
								}}
							>
								<Text style={{ fontSize: 30, fontWeight: "bold" }}>
									{this.state.user.name
										? this.state.user.name.charAt(0).toUpperCase()
										: null}
								</Text>
							</View>
						)}
						<View
							style={{
								flexDirection: "row",
								width: "100%",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									fontSize: 20,
									alignSelf: "center",
									fontWeight: "bold",
									marginVertical: 5,
								}}
							>
								{this.state.user ? this.state.user.name : "xxxxxxxx"}
							</Text>
							{this.state.user.verifiedAccount ? (
								<FontAwesome
									style={{ marginHorizontal: 5 }}
									name='check-circle'
									size={16}
								/>
							) : null}
						</View>
						<Text
							style={{
								fontWeight: "300",
								color: "#8F92A1",
								alignSelf: "center",
								marginBottom: 5,
							}}
						>
							{" "}
							@{this.state.user ? this.state.user.username : "xxxxxxx"}
						</Text>

						{this.state.user.accountType !== "news" ? (
							<View>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-around",
										alignSelf: "center",
										width: "80%",
										marginVertical: 10,
									}}
								>
									<View style={{ flexDirection: "row" }}>
										<Text style={{ fontSize: 16, fontWeight: "bold" }}>
											{this.state.user.following
												? this.state.user.following.length
												: 0}
										</Text>
										<Text
											style={{
												textAlign: "center",
												marginLeft: 10,
												fontSize: 16,
											}}
										>
											Followings
										</Text>
									</View>
									<View style={{ flexDirection: "row" }}>
										<Text style={{ fontSize: 16, fontWeight: "bold" }}>
											{this.state.user.followers
												? this.state.user.followers.length
												: 0}
										</Text>
										<Text
											style={{
												textAlign: "center",
												marginLeft: 10,
												fontSize: 16,
											}}
										>
											Followers
										</Text>
									</View>
								</View>
								<View>
									<Text
										style={{
											textAlign: "center",
											marginTop: 5,
											fontSize: 13,
											fontWeight: "300",
										}}
									>
										Political Stance
									</Text>
									<Slider
										minimumValue={0}
										maximumValue={3}
										disabled
										style={{ width: "80%", alignSelf: "center" }}
										step={1}
										minimumTrackTintColor={
											this.state.value == "1" ? "#3FBBFE" : "#D04AF7"
										}
										maximumTrackTintColor={"#FF4347"}
										value={this.state.value}
										onValueChange={(value) => this.setState({ value })}
									/>
									<View
										style={{
											flexDirection: "row",
											width: "80%",
											alignSelf: "center",
											justifyContent: "space-between",
										}}
									>
										<Text
											style={{
												textAlign: "center",
												fontWeight: "300",
												fontSize: 13,
												color: "#8F92A1",
											}}
										>
											Optimistic
										</Text>
										<Text
											style={{
												textAlign: "center",
												fontWeight: "300",
												fontSize: 13,
												color: "#8F92A1",
											}}
										>
											Neutral
										</Text>
										<Text
											style={{
												textAlign: "center",
												fontWeight: "300",
												fontSize: 13,
												color: "#8F92A1",
											}}
										>
											Moderate
										</Text>
									</View>
								</View>
							</View>
						) : null}
						{this.state.user.uid !== this.props.user.uid ? (
							this.state.user.accountType == "news" ? (
								<View style={{ width: "100%" }}>
									{this.props.user ? (
										this.props.user.following.includes(this.state.user.uid) ? (
											<TouchableOpacity
												onPress={this.unfollowUser}
												style={styles.cancl}
											>
												{/* #0384fc */}
												<View
													style={{
														...styles.button,
														backgroundColor: "#0384fc",
													}}
												>
													<FontAwesome
														style={{ marginHorizontal: 3, color: "white" }}
														name='check'
														size={18}
													/>
													<Text style={{ marginHorizontal: 3, color: "white" }}>
														Subscribed
													</Text>
												</View>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={this.followUser}
												style={{ ...styles.cancl }}
											>
												<View
													style={{
														...styles.button,
													}}
												>
													<FontAwesome
														style={{ marginHorizontal: 3 }}
														name='user-o'
														size={18}
													/>
													<Text style={{ marginHorizontal: 3 }}>Subscribe</Text>
												</View>
											</TouchableOpacity>
										)
									) : null}
								</View>
							) : (
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-around",
										// backgroundColor: 'skyblue',
										width: "90%",
										alignSelf: "center",
									}}
								>
									{this.props.user ? (
										this.props.user.following.includes(this.state.user.uid) ? (
											<TouchableOpacity
												onPress={this.unfollowUser}
												style={styles.cancl}
											>
												<View
													style={{
														...styles.button,
														backgroundColor: "#0384fc",
													}}
												>
													<FontAwesome
														style={{ marginHorizontal: 3, color: "white" }}
														name='check'
														size={18}
													/>
													<Text style={{ marginHorizontal: 3, color: "white" }}>
														Following
													</Text>
												</View>
											</TouchableOpacity>
										) : (
											<TouchableOpacity
												onPress={this.followUser}
												style={styles.cancl}
											>
												<View style={styles.button}>
													<FontAwesome
														style={{ marginHorizontal: 3 }}
														name='user-o'
														size={18}
													/>
													<Text style={{ marginHorizontal: 3 }}>Follow</Text>
												</View>
											</TouchableOpacity>
										)
									) : null}
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate("ChatDetail", {
												senderID: this.props.user.uid,
												receiverID: this.state.user.uid,
											})
										}
										style={[styles.cancl]}
									>
										<View style={styles.button}>
											<FontAwesome
												style={{ marginHorizontal: 3 }}
												name='envelope'
												size={18}
											/>
											<Text style={{ marginHorizontal: 3 }}>Message</Text>
										</View>
									</TouchableOpacity>
								</View>
							)
						) : null}

						{this.state.user.accountType !== "news" ? (
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									// backgroundColor: 'skyblue',
									width: "90%",
									alignSelf: "center",
								}}
							>
								<TouchableOpacity
									style={{
										margin: 15,
										padding: 10,
										borderRadius: 20,
										width: "90%",
										alignSelf: "center",
									}}
								>
									<Text
										style={{
											color: "black",
											fontWeight: "bold",
											alignSelf: "center",
											// marginLeft: 5,
										}}
									>
										Posts ({this.state.posts.length})
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										margin: 15,
										padding: 10,
										borderRadius: 20,
										width: "95%",
										alignSelf: "center",
									}}
								>
									<Text
										style={{
											color: "black",
											fontWeight: "bold",
											// marginLeft: 5,
											alignSelf: "center",
										}}
									>
										Discussions ({this.state.replies.length})
									</Text>
								</TouchableOpacity>
							</View>
						) : (
							<TouchableOpacity
								style={{
									margin: 15,
									padding: 10,
									borderRadius: 20,
									width: "90%",
									alignSelf: "center",
								}}
							>
								<Text
									style={{
										color: "black",
										fontWeight: "600",
										fontSize: 18,
										// marginLeft: 5,
										alignSelf: "center",
									}}
								>
									Articles ({this.state.posts.length})
								</Text>
								<Text
									style={{ fontSize: 45, textAlign: "center", marginTop: -30 }}
								>
									.
								</Text>
							</TouchableOpacity>
						)}
					</View>

					<FlatList
						data={this.state.posts}
						ListEmptyComponent={() => (
							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									paddingVertical: height / 6,
								}}
							>
								<Text
									style={{
										fontSize: 18,
										fontWeight: "300",
										textTransform: "uppercase",
										color: "#8F92A1",
									}}
								>
									No Posts to Display
								</Text>
							</View>
						)}
						renderItem={({ item, index }) => this.renderPosts(item, index)}
						ListFooterComponent={() => <View />}
						ListFooterComponentStyle={{ height: 100, width: "100%" }}
					/>
				</ScrollView>
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
		)
	}
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })

const mapDispatchToProps = (dispatch) => ({
	_followUser: (id) =>
		dispatch({
			type: ActionTypes.FOLLOW_USER,
			payload: {
				id,
			},
		}),
	_unfollowUser: (id) =>
		dispatch({
			type: ActionTypes.UNFOLLOW_USER,
			payload: {
				id,
			},
		}),
})

const connectComponent = connect(mapStateToProps, mapDispatchToProps)

export default connectComponent(Profile)

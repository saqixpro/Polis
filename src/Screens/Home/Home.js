import React, { Component } from "react"
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ImageBackground,
	Image,
	Dimensions,
	StatusBar,
	Easing,
	Animated,
	Share,
	Linking,
} from "react-native"
import styles from "./styles"
import theme from "../../theme"
import BottomTab from "../../components/bottomTab"
import { connect } from "react-redux"
import Functions from "../../functions/functions"
import * as ActionTypes from "../../redux/reducers/actionTypes"
import PostMenu from "../../components/postMenu"
import { PostSkeleton } from "../../components/skeletons"
import { FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import * as Permissions from "expo-permissions"
import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import firebase from "firebase"

const { height, width } = Dimensions.get("screen")

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			searc: "",
			isSearching: false,
			isRefreshing: false,
			alignment: new Animated.Value(0),
			thresholdReached: false,
			loading: false,
			pageNum: 1,
			refreshing: false,
			posts: [],
			cards: [],
			pod: null,
		}
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
		const { posts } = this.props
		const post = posts.find((_post) => _post.id == _id)
		let alreadyLiked = false
		if (post) {
			alreadyLiked = post.likes.find((id) => id == this.props.user.uid)
		}
		return alreadyLiked
	}

	fetchTrendingPostsAsync = async () => {
		const { posts } = await Functions.fetchTrendingPosts()
		this.setState({ cards: posts })
	}

	likePost = async (id) => {
		await Functions.likePost(id, this.props.user.uid)
		this.props.likePost(id, this.props.user.uid)
	}

	unlikePost = async (id) => {
		await Functions.unlikePost(id, this.props.user.uid)
		this.props.unlikePost(id, this.props.user.uid)
	}

	refreshPosts = async () => {
		this.setState({ refreshing: true })
		try {
			await this.fetchPostsForCurrentUser()
			await this.fetchTrendingPostsAsync()
			this.setState({ refreshing: false })
		} catch (error) {
			this.setState({ refreshing: false })
			alert(error.message)
		}
	}

	fetchPOD = async () => {
		const { pod } = await Functions.fetchPostOfTheDay()
		this.setState({ pod })
	}

	registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS,
			)
			let finalStatus = existingStatus
			if (existingStatus !== "granted") {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
				finalStatus = status
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!")
				return
			}
			const token = (await Notifications.getExpoPushTokenAsync()).data
			console.log(token)

			// Save Push TOken in Firebase
			try {
				const currentUser = firebase.auth().currentUser
				const ref = firebase
					.firestore()
					.collection("users")
					.doc(currentUser.uid)
				await ref.set({ pushToken: token }, { merge: true })
			} catch (err) {
				console.log(err.message)
			}
		} else {
			alert("Must use physical device for Push Notifications")
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			})
		}
	}

	calculateRemainingTime = (timeStamp) => {
		const now = Date.now()
		const remainingTimeInMS = timeStamp - now
		if (remainingTimeInMS > 0) {
			if (remainingTimeInMS / 1000 > 0) {
				if (remainingTimeInMS / 1000 / 60 > 0) {
					if (remainingTimeInMS / 1000 / 60 / 60 > 0) {
						return {
							time: (remainingTimeInMS / 1000 / 60 / 60).toFixed(0),
							unit: "Hrs",
						}
					} else
						return {
							time: remainingTimeInMS / 1000 / (60).toFixed(0),
							unit: "min",
						}
				} else return { time: remainingTimeInMS / (1000).toFixed(0), unit: "s" }
			} else return { time: remainingTimeInMS.toFixed(0), unit: "ms" }
		} else return { time: 0, unit: "ms" }
	}

	renderPolls = (item, index) => {
		return (
			<View style={{ ...styles.cardStyle, width, marginTop: 10 }}>
				<View
					style={[
						styles.horizontalContainer,
						{ width: "90%", alignSelf: "center" },
					]}
				>
					{item.author.avatar ? (
						<Image
							source={{ uri: item.author.avatar }}
							style={{
								height: 45,
								alignSelf: "center",
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
								{item.author.name
									? item.author.name.charAt(0).toUpperCase()
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
							width: "65%",
						}}
					>
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate("Profile", {
									uid: item.author.id,
								})
							}
							style={{ width: "100%" }}
						>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={[{ color: theme.colors.primary, fontWeight: "300" }]}
								>
									{item.author.name}
								</Text>
								{item.author.verifiedAccount ? (
									<FontAwesome
										style={{ marginHorizontal: 5 }}
										name='check-circle'
										size={16}
									/>
								) : null}
							</View>
							<Text style={{ color: theme.colors.primary, fontWeight: "300" }}>
								{item.author.username}
							</Text>
						</TouchableOpacity>
						<Text
							style={[
								{
									fontSize: 12,
									color: "#8F92A1",
									fontWeight: "300",
								},
							]}
						>{`${this.formatTime(item.timeStamp)} ago`}</Text>
					</View>
				</View>
				<View style={styles.postContent}>
					<Text style={{ marginVertical: 15, fontWeight: "300" }}>
						{item.textContent}
					</Text>
					{item.poll.map((poll) => (
						<TouchableOpacity
							onPress={() => this.castVote(item.id, poll.id)}
							disabled={
								this.voteAlreadyCasted(item.id) ||
								this.calculateRemainingTime(item.expireTime).time <= 0
							}
							style={{
								backgroundColor: "#dcdcdc",
								height: 40,
								flexDirection: "row",
								marginVertical: 5,
								width: width / 1.2,
								borderRadius: 10,
								alignSelf: "center",
							}}
						>
							{this.voteAlreadyCasted(item.id) ||
							this.calculateRemainingTime(item.timeStamp).time <= 0 ? (
								<View
									style={{
										backgroundColor: "#333",
										borderTopRightRadius: 10,
										borderBottomRightRadius: 10,
										height: "100%",
										width: `${(+poll.votes.length * 100) / +item.votes}%`,
									}}
								/>
							) : null}
							<Text
								style={{
									color: "#fff",
									position: "absolute",
									fontWeight: "600",
									left: "5%",
									top: 10,
									zIndex: 1000,
									width: "90%",
									fontSize: 16,
								}}
							>
								{poll.val}
							</Text>
							{this.voteAlreadyCasted(item.id) ||
							this.calculateRemainingTime(item.expireTime).time <= 0 ? (
								<Text
									style={{
										position: "absolute",
										fontWeight: "600",
										right: 10,
										zIndex: 1000,
										color:
											(poll.votes.length * 100) / item.votes > 95
												? "white"
												: "black",
										top: 10,
									}}
								>
									{(poll.votes.length * 100) / item.votes}%
								</Text>
							) : null}
						</TouchableOpacity>
					))}
					<View
						style={{
							flexDirection: "row",
							marginVertical: 5,
							justifyContent: "space-between",
						}}
					>
						<Text style={{ fontSize: 12, fontWeight: "300", color: "#8F92A1" }}>
							{this.calculateRemainingTime(item.expireTime).time}{" "}
							{this.calculateRemainingTime(item.expireTime).unit} Remaining
						</Text>
						<Text style={{ fontSize: 12, fontWeight: "300", color: "#8F92A1" }}>
							{item.votes} votes
						</Text>
					</View>
				</View>
				<View
					style={[
						styles.horizontalContainer,
						{
							justifyContent: "space-between",
							width: "85%",
							alignSelf: "center",
						},
					]}
				>
					<TouchableOpacity
						onPress={() =>
							this.props.navigation.navigate("CommentScreen", {
								postID: item.id,
							})
						}
					>
						<View style={[styles.bottomContainer]}>
							<FontAwesome5 name='comment-alt' size={18} color='gray' />
							<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
								{item.comments.length}
							</Text>
						</View>
					</TouchableOpacity>
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
							{item.likes.length}
						</Text>
					</View>
				</View>
			</View>
		)
	}

	castVote = async (postID, optionId) => {
		await Functions.castVote(this.props.user.uid, postID, optionId)
		this.props.castVote(postID, optionId, this.props.user.uid)
	}

	voteAlreadyCasted = (postID) => {
		const currentPost = this.props.posts.find((post) => post.id == postID)
		const poll = currentPost ? currentPost.poll : null
		try {
			if (poll) {
				const valid = poll.find((p) => p.votes.includes(this.props.user.uid))
					? true
					: false
				return valid
			}

			return false
		} catch (error) {
			alert(error.message)
		}
	}

	renderPosts = (item, index) => {
		return (
			<TouchableOpacity
				key={index}
				activeOpacity={0.9}
				style={{ ...styles.cardStyle, width, marginTop: 10 }}
			>
				<View
					style={[
						styles.horizontalContainer,
						{ width: "90%", alignSelf: "center" },
					]}
				>
					{item.author.avatar ? (
						<Image
							source={{ uri: item.author.avatar }}
							style={{
								height: 45,
								alignSelf: "center",
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
								{item.author.name
									? item.author.name.charAt(0).toUpperCase()
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
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate("Profile", {
									uid: item.author.id,
								})
							}
							style={{ width: "100%" }}
						>
							<View style={{ flexDirection: "row" }}>
								<Text
									style={[{ color: theme.colors.primary, fontWeight: "300" }]}
								>
									{item.author.name}
								</Text>
								{item.author.verifiedAccount ? (
									<FontAwesome
										style={{ marginHorizontal: 5 }}
										name='check-circle'
										size={16}
									/>
								) : null}
							</View>
							<Text style={{ color: theme.colors.primary, fontWeight: "300" }}>
								{item.author.username}
							</Text>
						</TouchableOpacity>
						<Text
							style={[
								{
									fontSize: 12,
									color: "#8F92A1",
									fontWeight: "300",
								},
							]}
						>{`${this.formatTime(item.timeStamp)} ago`}</Text>
					</View>
				</View>
				<View style={styles.postContent}>
					{item.image ? (
						<Image
							style={styles.questionImage}
							resizeMode={"cover"}
							source={{ uri: item.image }}
						/>
					) : null}

					<Text style={{ marginVertical: 15, fontWeight: "300" }}>
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
							width: "80%",
							alignSelf: "center",
						},
					]}
				>
					<TouchableOpacity
						onPress={() =>
							this.props.navigation.navigate("CommentScreen", {
								postID: item.id,
							})
						}
					>
						<View style={[styles.bottomContainer]}>
							<FontAwesome5 name='comment-alt' size={18} color='gray' />
							<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
								{item.comments.length}
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
								<FontAwesome name='heart' size={18} color='red' />
							</TouchableOpacity>
						) : (
							<TouchableOpacity onPress={() => this.likePost(item.id)}>
								<FontAwesome name='heart-o' size={18} color='grey' />
							</TouchableOpacity>
						)}
						<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
							{item.likes.length}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	renderTopHeader = () => (
		<View>
			<View
				style={{
					height: Dimensions.get("screen").height / 2.5,
					paddingVertical: 20,
				}}
			>
				<ImageBackground
					resizeMode={"cover"}
					source={this.state.pod ? { uri: this.state.pod.image } : null}
					style={{
						width: Dimensions.get("screen").width,
						height: Dimensions.get("screen").height / 2.8,
						marginTop: -20,
						// backgroundColor: 'tomato',
					}}
				>
					<View style={styles.filter} />
					<TouchableOpacity
						style={{ marginTop: 15 }}
						onPress={() =>
							this.props.navigation.navigate("ProfileStack", {
								uid: this.props.user.uid,
							})
						}
					>
						{this.props.user.avatar ? (
							<Image
								source={{ uri: this.props.user.avatar }}
								style={{
									...styles.cardimage,
									height: 55,
									backgroundColor: "blue",
									width: 55,
									borderRadius: 20,
									justifyContent: "space-around",
									marginBottom: 15,
								}}
							/>
						) : (
							<View
								style={{
									height: 55,
									...styles.cardimage,
									backgroundColor: "#fff",
									width: 55,
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
									{this.props.user.name
										? this.props.user.name.charAt(0).toUpperCase()
										: null}
								</Text>
							</View>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={{ marginTop: -15 }}
						activeOpacity={0.6}
						onPress={() =>
							this.props.navigation.navigate("MainComment", {
								pod: this.state.pod,
							})
						}
					>
						<Text
							style={[
								styles.largeText,
								{
									marginTop: 10,
									marginLeft: 10,
									width: "50%",
									fontSize: 12,
									color: "#fff",
									textTransform: "uppercase",
									fontWeight: "bold",
									marginVertical: 1,
								},
							]}
						>
							Topic of the day :
						</Text>
						<Text
							style={[
								styles.largeText,
								{
									width: "60%",
									marginLeft: "10%",
									maxHeight: 80,
									overflow: "hidden",
									marginTop: 10,
									marginBottom: 10,
									fontSize: 19,
									fontWeight: "600",
								},
							]}
						>
							{this.state.pod ? this.state.pod.textContent : null}
						</Text>
					</TouchableOpacity>
				</ImageBackground>
				<FlatList
					showsHorizontalScrollIndicator={false}
					horizontal
					style={{
						position: "absolute",
						bottom: 2,
						left: 0,
						right: 0,
						paddingVertical: 10,
					}}
					data={this.state.cards}
					extraData={this.state}
					renderItem={this.renderCards}
					keyExtractor={(item, index) => item + index.toString()}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</View>
	)

	renderCards = ({ item, index }) => {
		return (
			<View
				style={{
					width: 150,
					height: 90,
					backgroundColor: "#fff",
					shadowColor: "#ccc",
					shadowOffset: {
						width: 3,
						height: 3,
					},
					shadowOpacity: 0.8,
					marginHorizontal: 6,
					borderRadius: 20,
				}}
			>
				<TouchableOpacity
					onPress={() =>
						this.props.navigation.navigate("CommentScreen", { postID: item.id })
					}
					style={{
						width: "100%",
						height: "100%",
						justifyContent: "center",
						overflow: "hidden",
						paddingHorizontal: 20,
						paddingVertical: 15,
					}}
				>
					<Text
						style={{
							textAlign: "left",
							width: "80%",
							fontSize: 12,
							fontWeight: "400",
							overflow: "hidden",
						}}
					>
						{item.textContent}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "flex-end",
							marginRight: 5,
						}}
					>
						<Text
							style={{
								marginRight: 5,
								fontSize: 10,
								fontWeight: "bold",
								padding: 3,
							}}
						>
							{item.comments.length}
						</Text>
						<TouchableOpacity
							onPress={() =>
								this.props.navigation.navigate("CommentScreen", {
									postID: item.id,
								})
							}
						>
							<FontAwesome5 name='comment-alt' size={16} color='gray' />
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	filterPosts = (filter) => {
		const { posts } = this.props
		let _posts
		switch (filter) {
			case "news":
				_posts = posts.filter((post) => post.type == "news")
				break
			case "verified":
				_posts = posts.filter((post) => post.author.verifiedAccount)
				break
			case "following":
				_posts = posts.filter((post) =>
					this.props.user.following.includes(post.author.id),
				)
				break
			default:
				_posts = posts
		}

		_posts = _posts.sort((a, b) => {
			return a.timeStamp < b.timeStamp ? 1 : a.timeStamp > b.timeStamp ? -1 : 0
		})

		if (_posts.length > 0) {
			this.setState({ posts: _posts })
		} else {
			this.setState({ posts: [{ msg: "NO POSTS TO DISPLAY" }] })
		}
	}

	fetchPostsForCurrentUser = async () => {
		const { posts } = await Functions.fetchPosts()
		this.setState({
			posts: posts.sort((a, b) => {
				return a.timeStamp < b.timeStamp
					? 1
					: a.timeStamp > b.timeStamp
					? -1
					: 0
			}),
		})
		this.props.cachePosts(posts)
	}

	componentDidMount = async () => {
		await this.fetchPOD()
		await this.fetchTrendingPostsAsync()
		await this.fetchPostsForCurrentUser()
		this.registerForPushNotificationsAsync()
	}

	animateBottomTabs = (val) =>
		Animated.timing(this.state.alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

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

		return (
			<View style={styles.mainContainer}>
				<StatusBar barStyle='light-content' />
				<View>
					<FlatList
						style={{ height: "100%", width: width, zIndex: 10000 }}
						ListHeaderComponent={this.renderTopHeader}
						ListFooterComponent={() => <View />}
						stickyHeaderIndices={[1]}
						ListFooterComponentStyle={{ height: 200, width: "100%" }}
						onScrollBeginDrag={(e) => {
							this.animateBottomTabs(1)
						}}
						onScroll={(e) => {
							if (
								e.nativeEvent.contentOffset.y >= 290 &&
								e.nativeEvent.contentOffset.y <= 310
							) {
								this.setState({ thresholdReached: true })
							} else if (e.nativeEvent.contentOffset.y <= 0) {
								this.setState({ thresholdReached: false })
							}
						}}
						maxToRenderPerBatch={5}
						onScrollEndDrag={() => this.animateBottomTabs(0)}
						data={[{ tx: "menuBar" }, ...this.state.posts]}
						scrollEventThrottle={16}
						alwaysBounceVertical={false}
						keyExtractor={(item, index) => item + index.toString()}
						extraData={[{ tx: "menuBar" }, ...this.props.posts]}
						refreshing={this.state.refreshing}
						onRefresh={this.refreshPosts}
						renderItem={({ item, index }) =>
							item.tx == "menuBar" ? (
								<PostMenu
									newsPosts={() => this.filterPosts("news")}
									allPosts={() => this.filterPosts("all")}
									verifiedPosts={() => this.filterPosts("verified")}
									followingPosts={() => this.filterPosts("following")}
									style={
										this.state.thresholdReached
											? { paddingTop: 80, paddingBottom: 50 }
											: null
									}
								/>
							) : item.poll ? (
								this.renderPolls(item, index)
							) : (
								this.renderPosts(item, index)
							)
						}
						showsVerticalScrollIndicator={false}
					/>
				</View>
				<View
					style={{
						width: "100%",
						backgroundColor: "#fff",
						height: 70,
						zIndex: 10000,
						position: "absolute",
						bottom: 0,
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

const mapStateToProps = (state) => ({
	user: state.rootReducer.user,
	posts: state.rootReducer.posts,
})
const mapDispatchToProps = (dispatch) => ({
	cachePosts: (posts) =>
		dispatch({
			type: ActionTypes.CACHE_POSTS,
			payload: {
				posts,
			},
		}),
	likePost: (id, userID) =>
		dispatch({
			type: ActionTypes.LIKE_POST,
			payload: {
				id,
				userID,
			},
		}),
	unlikePost: (id, userID) =>
		dispatch({
			type: ActionTypes.UNLIKE_POST,
			payload: {
				id,
				userID,
			},
		}),
	castVote: (postID, optionID, userID) =>
		dispatch({
			type: ActionTypes.CAST_VOTE,
			payload: {
				postID,
				optionID,
				userID,
			},
		}),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(Home)

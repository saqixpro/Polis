import React, { Component } from "react"
import {
	View,
	Text,
	Image,
	Animated,
	SafeAreaView,
	Dimensions,
	KeyboardAvoidingView,
	Alert,
} from "react-native"
import styles from "./styles"
import theme from "../../theme"
import BottomTab from "../../components/bottomTab"
import Functions from "../../functions/functions"
import { connect } from "react-redux"
import * as ActionTypes from "../../redux/reducers/actionTypes"
import {
	FontAwesome5,
	FontAwesome,
	MaterialCommunityIcons,
} from "@expo/vector-icons"
import firebase, { auth } from "firebase"
import {
	TouchableOpacity,
	FlatList,
	TextInput,
} from "react-native-gesture-handler"
import * as Notifications from "../../functions/notifications"

const { width } = Dimensions.get("screen")

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

const RenderReplies = ({ item, state, updateState, inputRef, listRef }) => {
	const replyComment = (id) => {
		const { comments } = state
		const comment = comments.find((cmt) =>
			cmt.replies.find((reply) => reply.id === id),
		)
		const { author } = comment
		updateState({ activeAuthor: author.username, activeChannel: comment.id })
		inputRef.focus()
		listRef ? listRef.scrollToEnd({ animated: true }) : null
	}

	return (
		<View style={[styles.cardStyle]}>
			<View
				style={[
					styles.horizontal,
					{
						justifyContent: "space-between",
						maxWidth: "90%",
						alignSelf: "center",
					},
				]}
			>
				<View style={{}}>
					{item.author.avatar ? (
						<Image
							source={{ uri: item.author.avatar }}
							style={[styles.userImgStyle]}
						/>
					) : (
						<View
							style={{
								height: 40,
								backgroundColor: "#fff",
								width: 40,
								borderRadius: 15,
								justifyContent: "space-around",
								alignItems: "center",
								shadowColor: "#aaa",
								shadowOffset: {
									width: 3,
									height: 3,
								},
								shadowOpacity: 0.9,
								marginHorizontal: 12,
								shadowRadius: 3.5,
							}}
						>
							<Text style={{ fontSize: 25, fontWeight: "bold" }}>
								{item.author.name
									? item.author.name.charAt(0).toUpperCase()
									: null}
							</Text>
						</View>
					)}
				</View>
				<View
					style={{
						justifyContent: "space-between",
						flexDirection: "row",
						alignSelf: "center",
						width: "80%",
					}}
				>
					<View>
						<Text style={{ fontWeight: "bold", fontSize: 12 }}>
							{item.author.name}
						</Text>
						<Text style={{ color: "#8F92A1", fontSize: 12 }}>
							@{item.author.username}
						</Text>
					</View>
					<Text
						style={[
							{
								fontSize: 12,
								marginTop: -5,
								alignSelf: "center",
								color: "#8F92A1",

								// color: theme.colors.gray,
							},
						]}
					>
						{formatTime(item.timeStamp)} ago{" "}
					</Text>
				</View>
			</View>
			{/* <Text style={[styles.largeText, {color: theme.colors.gray}]}>
        {`${item.mention} @AlexJobra`}
      </Text> */}
			<View
				style={{
					alignSelf: "center",
					width: "70%",
					alignItems: "flex-start",
					paddingVertical: 5,
				}}
			>
				<Text style={[styles.mediumText, { marginVertical: 10 }]}>
					{item.textContent}
				</Text>
			</View>
			<View
				style={[
					styles.horizontal,
					{
						justifyContent: "space-between",
						alignSelf: "flex-start",
						marginLeft: "6%",
						width: "40%",
					},
				]}
			>
				<TouchableOpacity
					style={{ marginHorizontal: 10 }}
					onPress={() => replyComment(item.id)}
				>
					<View style={[styles.bottomContainer]}>
						<FontAwesome5 name='comment-alt' size={20} color='gray' />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

class CommentScreen extends Component {
	input = null
	listRef = null

	state = {
		cmnt: "",
		alignment: new Animated.Value(0),
		post: {},
		comments: [],
		activeAuthor: "",
		activeChannel: null,
		repliesVisible: false,
	}

	componentDidMount = () => {
		this.fetchPost()
	}

	fetchPost = async () => {
		try {
			const { postID } = this.props.navigation.state.params
			const post = this.props.posts.find((post) => post.id == postID)

			// FETCH Author Data For Each Comment
			let comments = await firebase
				.firestore()
				.collection("comments")
				.where("postID", "==", post.id)
				.get()

			comments = comments.docs.map((cmt) => ({ id: cmt.id, ...cmt.data() }))

			if (comments.length > 0) {
				for (let i = 0; i < comments.length; i++) {
					const _author =
						typeof comments[i].author == "string"
							? comments[i].author
							: comments[i].author.uid
					const { user } = await Functions.fetchUserById(_author)
					comments[i] = { ...comments[i], author: user }

					for (let j = 0; j < comments[i].replies.length; j++) {
						const node = comments[i].replies[j]
						const __author =
							typeof node.author == "string" ? node.author : node.author.uid
						const { user } = await Functions.fetchUserById(__author)
						comments[i].replies[j] = { ...node, author: user }
					}
				}
				this.setState({
					comments: comments.sort((a, b) => {
						return a.timeStamp < b.timeStamp
							? 1
							: b.timeStamp < a.timeStamp
							? -1
							: 0
					}),
				})
			} else this.setState({ comments: [] })

			this.setState({ post })
		} catch (error) {
			console.log(error)
		}
	}

	likeComment = async (id) => {
		const comment = this.state.comments.find((cmt) => cmt.id == id)
		const updatedComment = {
			...comment,
			likes: [...comment.likes, this.props.user.uid],
		}
		const updatedComments = this.state.comments.map((cmt) =>
			cmt.id == id ? updatedComment : cmt,
		)
		this.setState({ comments: updatedComments })

		const COMMENT = await firebase
			.firestore()
			.collection("comments")
			.doc(id)
			.get()
		const LIKES = COMMENT.data().likes
			? [...comment.data().likes, this.props.user.uid]
			: [this.props.user.uid]
		COMMENT.ref.set({ likes: LIKES }, { merge: true })

		const { user } = await Functions.fetchUserById(comment.author)

		Notifications.sendExpoNotification(
			user.expoToken,
			`Polis`,
			`${this.props.user.name} liked your comment`,
		)

		firebase
			.firestore()
			.collection("Notifications")
			.add({
				postID: this.props.navigation.state.params.postID,
				user: user.id,
				type: "like",
				textContent: `${this.props.user.name} liked your Comment`,
				timeStamp: Date.now(),
			})
	}

	replyComment = (id) => {
		const comment = this.state.comments.find((cmt) => cmt.id == id)
		const { author } = comment
		this.setState({ activeAuthor: author.username, activeChannel: id })
		this.input.focus()
	}

	unlikeComment = async (id) => {
		const comment = this.state.comments.find((cmt) => cmt.id == id)
		const updatedComment = {
			...comment,
			likes: comment.likes.filter((id) => id !== this.props.user.uid),
		}
		const updatedComments = this.state.comments.map((cmt) =>
			cmt.id == id ? updatedComment : cmt,
		)

		this.setState({ comments: updatedComments })
	}

	liked = (_id) => {
		const { comments } = this.state
		const comment = comments.find((cmt) => cmt.id == _id)
		let alreadyLiked = false
		if (comment) {
			alreadyLiked = comment.likes.find((id) => id == this.props.user.uid)
		}
		return alreadyLiked
	}

	makeComment = async () => {
		const data = {
			postID: this.state.post.id,
			textContent: this.state.cmnt,
			author: this.props.user.uid,
			likes: [],
			replies: [],
			timeStamp: Date.now(),
		}

		const { comments } = this.state

		// Check for active Author

		if (this.state.activeAuthor) {
			const comment = comments.find((cmt) => cmt.id == this.state.activeChannel)
			// add new comment as a child
			const _data = {
				textContent: this.state.cmnt,
				author: this.props.user.uid,
				likes: [],
				replies: [],
				timeStamp: Date.now(),
			}

			const updatedComment = {
				...comment,
				replies: [...comment.replies, _data],
			}

			await firebase
				.firestore()
				.collection("comments")
				.doc(this.state.activeChannel)
				.set({ replies: [...comment.replies, _data] }, { merge: true })

			const updatedComments = comments.map((cmt) =>
				cmt.id == comment.id ? updatedComment : cmt,
			)

			this.setState({ comments: updatedComments })
		} else {
			comments.push({ ...data, author: this.props.user })
			this.setState({ comments })
			const updatedPost = { ...this.state.post, comments: comments }
			await this.props.updatePost(updatedPost, this.state.post.id)
			await Functions.makeComment(data)
		}
		try {
			const { user } = await Functions.fetchUserById(this.state.post.author)

			Notifications.sendExpoNotification(
				user.expoToken,
				`Polis`,
				`${this.props.user.name} commented on your Post`,
			)

			firebase
				.firestore()
				.collection("Notifications")
				.add({
					user: user.id,
					postID: this.state.post.id,
					type: "comment",
					textContent: `${this.props.user.name} commented on your Post`,
					timeStamp: Date.now(),
				})
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	renderComments = ({ item, index }) => {
		return (
			<View style={styles.cardStyle}>
				<View
					style={[
						styles.horizontal,
						{
							justifyContent: "space-between",
							maxWidth: "90%",
							alignSelf: "center",
						},
					]}
				>
					<View style={{}}>
						{item.author.avatar ? (
							<Image
								source={{ uri: item.author.avatar }}
								style={styles.userImgStyle}
							/>
						) : (
							<View
								style={{
									height: 40,
									backgroundColor: "#fff",
									width: 40,
									borderRadius: 15,
									justifyContent: "space-around",
									alignItems: "center",
									shadowColor: "#aaa",
									shadowOffset: {
										width: 3,
										height: 3,
									},
									shadowOpacity: 0.9,
									marginHorizontal: 12,
									shadowRadius: 3.5,
								}}
							>
								<Text style={{ fontSize: 25, fontWeight: "bold" }}>
									{item.author.name
										? item.author.name.charAt(0).toUpperCase()
										: null}
								</Text>
							</View>
						)}
					</View>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							alignSelf: "center",
							width: "80%",
						}}
					>
						<View>
							<Text style={{ fontWeight: "bold", fontSize: 12 }}>
								{item.author.name}
							</Text>
							<Text style={{ color: "#8F92A1", fontSize: 12 }}>
								@{item.author.username}
							</Text>
						</View>
						<Text
							style={[
								{
									fontSize: 12,
									marginTop: -5,
									alignSelf: "center",
									color: "#8F92A1",

									// color: theme.colors.gray,
								},
							]}
						>
							{formatTime(item.timeStamp)} ago{" "}
						</Text>
					</View>
				</View>
				{/* <Text style={[styles.largeText, {color: theme.colors.gray}]}>
        {`${item.mention} @AlexJobra`}
      </Text> */}
				<View
					style={{
						alignSelf: "center",
						width: "70%",
						alignItems: "flex-start",
						paddingVertical: 5,
					}}
				>
					<Text style={[styles.mediumText, { marginVertical: 10 }]}>
						{item.textContent}
					</Text>
				</View>
				<View
					style={[
						styles.horizontal,
						{
							justifyContent: "space-between",
							alignSelf: "flex-start",
							marginLeft: "6%",
							width: "40%",
						},
					]}
				>
					<TouchableOpacity
						style={{ marginHorizontal: 10 }}
						onPress={() => this.replyComment(item.id)}
					>
						<View style={[styles.bottomContainer]}>
							<FontAwesome5 name='comment-alt' size={20} color='gray' />
							<Text style={{ marginLeft: 5 }}>
								{item.replies ? item.replies.length : 0}
							</Text>
						</View>
					</TouchableOpacity>
					<View style={[styles.bottomContainer]}>
						{this.liked(item.id) ? (
							<TouchableOpacity
								onPress={() => this.unlikeComment(item.id)}
								style={{ marginHorizontal: 10 }}
							>
								<FontAwesome name='heart' size={22} color='red' />
							</TouchableOpacity>
						) : (
							<TouchableOpacity
								onPress={() => this.likeComment(item.id)}
								style={{ marginHorizontal: 10 }}
							>
								<FontAwesome name='heart-o' size={22} color='gray' />
							</TouchableOpacity>
						)}
						<Text>{item.likes ? item.likes.length : 0}</Text>
					</View>
					{!this.state.repliesVisible ? (
						<View style={[styles.bottomContainer, { marginLeft: "30%" }]}>
							<TouchableOpacity
								onPress={() => this.setState({ repliesVisible: true })}
							>
								<Text style={{ fontWeight: "600" }}>
									Replies ({item.replies.length})
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={[styles.bottomContainer, { marginLeft: "30%" }]}>
							<TouchableOpacity
								onPress={() => this.setState({ repliesVisible: false })}
							>
								<Text style={{ fontWeight: "600" }}>
									Replies ({item.replies.length})
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
				{this.state.repliesVisible ? (
					<FlatList
						data={item.replies}
						renderItem={(data) => (
							<RenderReplies
								item={data.item}
								state={this.state}
								user={this.props.user}
								inputRef={this.input}
								listRef={this.listRef}
								updateState={(data) => this.setState(data)}
							/>
						)}
					/>
				) : null}
			</View>
		)
	}

	Post = () => {
		return this.state.post && this.state.post.author ? (
			<View style={styles.cardStyle}>
				<View style={[styles.horizontal, { width: width / 1.2 }]}>
					<View style={{}}>
						{this.state.post.author.avatar ? (
							<Image
								source={{ uri: this.state.post.author.avatar }}
								style={styles.userImgStyle}
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
									marginHorizontal: 12,
									shadowRadius: 3.5,
								}}
							>
								<Text style={{ fontSize: 30, fontWeight: "bold" }}>
									{this.state.post.author
										? this.state.post.author.name.charAt(0).toUpperCase()
										: null}
								</Text>
							</View>
						)}
					</View>
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							alignSelf: "center",
							width: "80%",
						}}
					>
						<View style={{ width: "60%" }}>
							<Text style={{ fontWeight: "bold" }}>
								{this.state.post.author ? this.state.post.author.name : null}
							</Text>
							<Text style={{ color: "#8F92A1" }}>
								@
								{this.state.post.author
									? this.state.post.author.username
									: null}
							</Text>
						</View>
						<Text
							style={[
								{
									// fontFamily: Fonts.RobotoRegular,
									fontSize: 12,
									alignSelf: "center",
									color: "#8F92A1",

									// color: theme.colors.gray,
								},
							]}
						>
							{formatTime(this.state.post.timeStamp)} ago{" "}
						</Text>
					</View>
				</View>
				<View>
					{this.state.post.image ? (
						<Image
							style={styles.questionImage}
							resizeMode='cover'
							source={{ uri: this.state.post.image }}
						/>
					) : null}

					<Text
						style={[styles.mediumText, { marginVertical: 15, maxWidth: "75%" }]}
					>
						{this.state.post.textContent}
					</Text>
				</View>
			</View>
		) : null
	}
	onImageChange = (event) => {
		const { uri, linkUri, mime, data } = event.nativeEvent
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
				<SafeAreaView />
				<this.Post />
				<View style={{ alignSelf: "center", width: "80%" }}>
					<Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 20 }}>
						Comments (
						{this.state.post.comments ? this.state.post.comments.length : 0})
					</Text>
				</View>
				<FlatList
					ref={(ref) => {
						this.listRef = ref
					}}
					data={this.state.comments}
					renderItem={({ item }) => <this.renderComments item={item} />}
				/>
				<KeyboardAvoidingView keyboardVerticalOffset={20} behavior='padding'>
					{this.state.post.author ? (
						<Text style={styles.replying}>
							Replying to @
							{this.state.activeAuthor || this.state.post.author.username}
						</Text>
					) : null}
					<View
						style={[
							styles.horizontalContainer,
							{ marginTop: 10, marginBottom: 20 },
						]}
					>
						<TextInput
							style={styles.input}
							ref={(ref) => (this.input = ref)}
							placeholder='Reply to the post'
							autoCapitalize={"none"}
							returnKeyType={"done"}
							keyboardType={"default"}
							placeholderTextColor='gray'
							value={this.state.cmnt}
							underlineColorAndroid='transparent'
							onChangeText={(cmnt) => {
								this.setState({ cmnt })
							}}
						/>
						<TouchableOpacity
							onPress={this.makeComment}
							style={{ alignSelf: "center", marginLeft: 15 }}
						>
							<MaterialCommunityIcons
								name='send'
								size={32}
								color={theme.colors.primary}
							/>
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
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.rootReducer.user,
	posts: state.rootReducer.posts,
})
const mapDispatchToProps = (dispatch) => ({
	updatePost: (data, id) =>
		dispatch({
			type: ActionTypes.MAKE_COMMENT,
			payload: {
				data,
				id,
			},
		}),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(CommentScreen)

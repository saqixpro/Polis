import React, { Component } from "react"
import {
	View,
	Text,
	Image,
	Animated,
	Dimensions,
	Easing,
	SafeAreaView,
	KeyboardAvoidingView,
	TextInput,
	FlatList,
	ActivityIndicator,
	Alert,
} from "react-native"
import styles from "./styles"
import BottomTab from "../../components/bottomTab"
import { connect } from "react-redux"
import { TouchableOpacity } from "react-native-gesture-handler"
import firebase from "firebase"

import {
	FontAwesome,
	FontAwesome5,
	MaterialCommunityIcons,
} from "@expo/vector-icons"
import Functions from "../../functions/functions"

const { height, width } = Dimensions.get("screen")

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

class CommentScreen extends Component {
	inputRef = null
	listRef = null
	constructor(props) {
		super(props)
		this.state = {
			cmnt: "",
			alignment: new Animated.Value(0),
			comments: [],
			pod: null,
			activeAuthor: null,
			activeChannel: null,
			repliesVisible: true,
		}
	}

	componentDidMount = () => {
		this.fetchPOD()
	}

	replyComment = (id) => {
		const comment = this.state.comments.find((cmt) => cmt.id == id)
		const { author } = comment
		this.setState({ activeAuthor: author.username, activeChannel: id })
		this.inputRef.focus()
	}

	likePost = async () => {
		try {
			let { pod } = this.state
			pod = { ...pod, likes: [...pod.likes, this.props.user.uid] }
			this.setState({ pod })

			const ref = firebase.firestore().collection("pod").doc("pod")
			const POD = await ref.get()
			const likes = POD.likes
				? [...POD.likes, this.props.user.uid]
				: [this.props.user.uid]

			ref.set({ likes: likes }, { merge: true })
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	likeComment = async (id) => {
		try {
			const comment = this.state.comments.find((cmt) => cmt.id == id)
			const updatedComment = {
				...comment,
				likes: [...comment.likes, this.props.user.uid],
			}
			const updatedComments = this.state.comments.map((cmt) =>
				cmt.id == id ? updatedComment : cmt,
			)
			this.setState({ comments: updatedComments })

			const POD = await firebase.firestore().collection("pod").doc("pod").get()
			const COMMENTS = POD.data().comments
			const COMMENT = COMMENTS.find((CMT) => CMT.id == id)
			const UPDATEDCOMMENT = {
				...COMMENT,
				likes: [...COMMENT.likes, this.props.user.uid],
			}
			const UPDATED_COMMENTS = COMMENTS.map((CMT) =>
				CMT.id == id ? UPDATEDCOMMENT : CMT,
			)

			POD.ref.set({ comments: UPDATED_COMMENTS }, { merge: true })
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	unlikeComment = async (id) => {
		try {
			const comment = this.state.comments.find((cmt) => cmt.id == id)
			const likes = comment.likes.filter((_id) => _id !== this.props.user.uid)
			const updated_comment = { ...comment, likes }
			let updated_comments = this.state.comments.map((cmt) =>
				cmt.id == id ? updated_comment : cmt,
			)

			await this.setState({ comments: updated_comments })

			const POD = await firebase.firestore().collection("pod").doc("pod").get()
			let __comment = POD.data().comments.find((cmt) => cmt.id == id)

			const _likes = __comment.likes.filter(
				(item) => item !== this.props.user.uid,
			)
			__comment = { ...__comment, likes: _likes }
			const __comments = POD.data().comments.map((cmt) =>
				cmt.id == id ? __comment : cmt,
			)

			POD.ref.set({ comments: __comments }, { merge: true })
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	unlikePod = async () => {
		try {
			let { pod } = this.state
			let { likes } = pod
			likes = likes.filter((id) => id !== this.props.user.uid)
			this.setState({ pod: { ...pod, likes } })

			const POD = await firebase.firestore().collection("pod").doc("pod").get()
			const __likes = POD.data().likes.filter(
				(id) => id !== this.props.user.uid,
			)
			POD.ref.set({ likes: __likes }, { merge: true })
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	fetchPOD = async () => {
		try {
			const { pod } = this.props.navigation.state.params
			this.setState({ pod }, async () => {
				const ref = firebase.firestore().collection("pod").doc("pod")
				let _pod = await ref.get()
				const comments = _pod.data().comments

				for (let i = 0; i < comments.length; i++) {
					const { user } = await Functions.fetchUserById(comments[i].author)
					comments[i] = { ...comments[i], author: user }

					for (let j = 0; j < comments[i].replies.length; j++) {
						const node = comments[i].replies[j]
						const __author =
							typeof node.author == "string" ? node.author : node.author.uid
						const { user } = await Functions.fetchUserById(__author)
						comments[i].replies[j] = { ...node, author: user }
					}
				}

				this.setState({ comments })
			})
		} catch (error) {
			Alert.alert(error.message)
		}
	}

	renderPosts = ({ item, index }) => {
		return (
			<View style={{ marginVertical: 20, width: "100%" }}>
				<View
					style={[
						styles.horizontal,
						{
							justifyContent: "space-between",
							maxWidth: "90%",
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
						{
							flexDirection: "row",
							justifyContent: "space-between",
							alignSelf: "flex-start",
							marginLeft: "6%",
							width: "60%",
						},
					]}
				>
					<TouchableOpacity
						style={{ marginHorizontal: 10 }}
						onPress={() => this.replyComment(item.id)}
					>
						<View style={styles.bottomContainer}>
							<FontAwesome5 name='comment-alt' size={20} color='gray' />
							<Text>{item.replies.length}</Text>
						</View>
					</TouchableOpacity>
					{this.liked(item.id) ? (
						<TouchableOpacity onPress={() => this.unlikeComment(item.id)}>
							<View style={styles.bottomContainer}>
								<FontAwesome name='heart' color='red' size={20} />
								<Text>{item.likes.length}</Text>
							</View>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={() => this.likeComment(item.id)}>
							<View style={styles.bottomContainer}>
								<FontAwesome name='heart-o' color='gray' size={20} />
								<Text>{item.likes.length}</Text>
							</View>
						</TouchableOpacity>
					)}
					{!this.state.repliesVisible ? (
						<View
							style={[
								{ padding: 5, flexDirection: "row" },
								{ marginLeft: "30%" },
							]}
						>
							<TouchableOpacity
								onPress={() => this.setState({ repliesVisible: true })}
							>
								<Text style={{ fontWeight: "600" }}>
									Replies ({item.replies.length})
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View
							style={[
								{ padding: 5, flexDirection: "row" },
								{ marginLeft: "30%" },
							]}
						>
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
								inputRef={this.inputRef}
								listRef={this.listRef}
								updateState={(data) => this.setState(data)}
							/>
						)}
					/>
				) : null}
			</View>
		)
	}

	animateBottomTabs = (val) =>
		Animated.timing(this.state.alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

	liked = (_id) => {
		const { comments } = this.state
		const comment = comments.find((cmt) => cmt.id == _id)
		if (comment) {
			const alreadyLiked = comment.likes.includes(this.props.user.uid)
			return alreadyLiked
		}
		return false
	}

	likedPod = () => {
		const { pod } = this.state
		return pod.likes.includes(this.props.user.uid) ? true : false
	}

	replyPost = () => {
		this.setState({ activeAuthor: null, activeChannel: null }, () => {
			this.inputRef.focus()
		})
	}

	makeComment = async () => {
		try {
			const data = {
				id: Date.now().toString(),
				textContent: this.state.cmnt,
				author: this.props.user.uid,
				likes: [],
				replies: [],
				timeStamp: Date.now(),
			}

			if (this.state.activeAuthor) {
				const comment = this.state.comments.find(
					(cmt) => cmt.id == this.state.activeChannel,
				)
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

				let updatedComments = this.state.comments.map((cmt) =>
					cmt.id == comment.id ? updatedComment : cmt,
				)

				for (let i = 0; i < updatedComments.length; i++) {
					for (let j = 0; j < updatedComments[i].replies.length; j++) {
						const node = updatedComments[i].replies[j]
						const __author =
							typeof node.author == "string" ? node.author : node.author.uid
						const { user } = await Functions.fetchUserById(__author)
						updatedComments[i].replies[j] = { ...node, author: user }
					}
				}

				this.listRef.scrollToEnd({ animated: true })

				this.setState({ comments: updatedComments })

				const POD = await firebase
					.firestore()
					.collection("pod")
					.doc("pod")
					.get()
				let __comment = POD.data().comments.find(
					(cmt) => cmt.id == this.state.activeChannel,
				)
				const __replies = comment.replies
					? [...comment.replies, _data]
					: [_data]
				__comment = { ...__comment, replies: __replies }
				const __COMMENTS = POD.data().comments.map((cmt) =>
					cmt.id == this.state.activeChannel ? __comment : cmt,
				)
				POD.ref.set({ comments: __COMMENTS }, { merge: true })
			} else {
				const comment = { ...data, author: this.props.user }

				this.listRef.scrollToEnd({ animated: true })

				await this.setState({
					comments: [...this.state.comments, comment],
				})

				const ref = firebase.firestore().collection("pod").doc("pod")
				let _comments = await ref.get()
				_comments = _comments.data().comments

				await ref.set({ comments: [..._comments, data] }, { merge: true })
			}
		} catch (error) {
			Alert.alert(error.message)
		}
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

		return this.state.pod ? (
			<View style={styles.mainContainer}>
				<SafeAreaView />
				<View style={styles.container}>
					<View style={styles.header}>
						<Image
							source={{ uri: this.state.pod.image }}
							style={styles.image}
							borderRadius={20}
						/>
						<View style={styles.content}>
							<Text style={styles.textContent}>
								{this.state.pod.textContent}
							</Text>
							<Text style={styles.url}>{this.state.pod.sourceUrl}</Text>
						</View>
						<View style={styles.actionBar}>
							<TouchableOpacity
								onPress={() => this.replyPost()}
								style={styles.actionButton}
							>
								<FontAwesome5
									style={styles.btnContent}
									name='comment-alt'
									size={20}
									color='gray'
								/>
								<Text style={styles.btnContent}>
									{this.state.pod.comments.length}
								</Text>
							</TouchableOpacity>

							{this.likedPod(this.state.pod.id) ? (
								<TouchableOpacity
									onPress={() => this.unlikePod()}
									style={styles.actionButton}
								>
									<FontAwesome
										style={styles.btnContent}
										name='heart'
										size={20}
										color='red'
									/>
									<Text style={styles.btnContent}>
										{this.state.pod.likes.length}
									</Text>
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									onPress={() => this.likePost()}
									style={styles.actionButton}
								>
									<FontAwesome
										style={styles.btnContent}
										name='heart-o'
										size={20}
										color='gray'
									/>
									<Text style={styles.btnContent}>
										{this.state.pod.likes.length}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
					<View style={[styles.body]}>
						<FlatList
							ref={(ref) => (this.listRef = ref)}
							data={this.state.comments}
							style={{ width: width / 1.1, maxHeight: "70%" }}
							renderItem={this.renderPosts}
							showsVerticalScrollIndicator={false}
						/>
					</View>
				</View>
				<KeyboardAvoidingView keyboardVerticalOffset={20} behavior='position'>
					<View style={styles.inputView}>
						<TextInput
							placeholder='Write Comment Here...'
							onChangeText={(text) => this.setState({ cmnt: text })}
							placeholderTextColor='#555'
							ref={(ref) => (this.inputRef = ref)}
							style={styles.input}
						/>
						<TouchableOpacity
							onPress={() => this.makeComment()}
							style={{ padding: 5 }}
						>
							<MaterialCommunityIcons name='send' size={30} />
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
				<View
					style={{
						width: "100%",
						backgroundColor: "#fff",
						height: 70,
						zIndex: 10000,
						marginTop: 10,
					}}
				>
					<Animated.View style={[bottomTabDynamicStyle]}>
						<BottomTab navigation={this.props.navigation} />
					</Animated.View>
				</View>
			</View>
		) : (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator color='black' />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(CommentScreen)

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
		<View
			style={{
				marginVertical: 20,
				width: "90%",
				alignSelf: "center",
			}}
		>
			<View
				style={[
					{
						flexDirection: "row",
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
					{
						flexDirection: "row",
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

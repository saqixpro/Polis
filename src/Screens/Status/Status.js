import React, { Component } from "react"
import {
	View,
	TouchableOpacity,
	Image,
	TextInput,
	Animated,
	Easing,
	KeyboardAvoidingView,
	Keyboard,
	Alert,
	ImageBackground,
} from "react-native"
import styles from "./styles"
import BottomTab from "../../components/bottomTab"
import { connect } from "react-redux"
import { Button, Text } from "native-base"
import Functions from "../../functions/functions"
import { Loader } from "../../utils/Loading"
import * as ActionTypes from "../../redux/reducers/actionTypes"
import ImagePicker from "expo-image-picker"
import * as ImageManipulator from "expo-image-manipulator"
import firebase from "firebase"

class Status extends Component {
	constructor(props) {
		super(props)

		this.state = {
			alignment: new Animated.Value(0),
			keyboardShown: false,
			totalText: 281,
			image: null,
			imgResult: null,
			textContent: "",
			loading: false,
		}

		Keyboard.addListener("keyboardDidShow", () =>
			this.setState({ keyboardShown: true }),
		)
		Keyboard.addListener("keyboardDidHide", () =>
			this.setState({ keyboardShown: false }),
		)
	}

	animateBottomTabs = (val) =>
		Animated.timing(this.state.alignment, {
			toValue: val,
			duration: 500,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start()

	handleChangeText = (text) => {
		this.setState({ textContent: text })
	}

	makePost = async () => {
		if (this.state.textContent.length > 5) {
			this.setState({ loading: true })

			await this.uploadImageToServerAsync()

			const data = {
				author: this.props.user.uid,
				timeStamp: Date.now(),
				textContent: this.state.textContent,
				type: "post",
				likes: [],
				comments: [],
				image: this.state.image || null,
			}

			await Functions.createPost(data)
			const { posts } = await Functions.fetchPosts(this.props.user.uid)
			this.props.cachePosts(posts)
			this.setState({ loading: false })
			this.props.navigation.navigate("Home")
		} else {
			this.setState({ loading: true })
			setTimeout(() => {
				this.setState({ loading: false })
				Alert.alert(
					`Text Content Can't Be Empty`,
					`Empty Posts are not allowed here`,
				)
			}, 1000)
		}
	}

	handleChoosePhoto = async () => {
		try {
			ImagePicker.launchImageLibrary(
				{
					mediaType: "mixed",
					allowsEditing: true,
					quality: 1,
				},
				async (result) => {
					const manipResult = await ImageManipulator.manipulateAsync(
						result.uri,
						[{ resize: { width: 160, height: 160 } }],
						{
							compress: 0.9,
							format: ImageManipulator.SaveFormat.PNG,
							base64: false,
						},
					).catch((err) => {
						this.setState({ loading: false })
					})

					if (manipResult) {
						this.setState({ imgResult: manipResult })
					}
				},
			)
		} catch (err) {
			alert(err.message)
		}
	}

	uploadImageToServerAsync = async () => {
		this.setState({ loading: true })
		try {
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest()
				xhr.onload = function () {
					resolve(xhr.response) // when BlobModule finishes reading, resolve with the blob
				}
				xhr.onerror = function () {
					that.setState({ loading: false })
					reject(new TypeError("Network request failed")) // error occurred, rejecting
				}
				xhr.responseType = "blob" // use BlobModule's UriHandler
				xhr.open("GET", this.state.imgResult.uri, true) // fetch the blob from uri in async mode
				xhr.send(null) // no initial data
			})

			this.setState({ loading: true })
			if (blob.size / 1000000 > 2) {
				this.setState({ loading: false }, () => {
					alert(languageJSON.IMAGE_SIZE_ERROR)
				})
			} else {
				var imageRef = firebase
					.storage()
					.ref()
					.child(`users/${this.props.user.uid}/post_assets/${Date.now()}/`)

				return imageRef.put(blob).then(async () => {
					blob.close()

					const dwnlurl = await imageRef.getDownloadURL()
					this.setState({ image: dwnlurl, loading: false })
				})
			}
		} catch (err) {
			alert(err.message)
		}
	}

	handleCancelImage = () => {
		this.setState({ imgResult: null })
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
		return (
			<View style={{ flex: 1, padding: 10 }}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: "5%",
						}}
					>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={styles.cancl}
						>
							<Text
								style={{ color: "black", fontSize: 16, fontWeight: "bold" }}
							>
								Cancel
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.buttonStyle}
							disabled={this.state.loading}
							onPress={() => this.makePost()}
						>
							<Text
								style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
							>
								Post
							</Text>
						</TouchableOpacity>
					</View>
					{this.state.loading ? (
						<Loader style={styles.loading} size='small' visible={true} />
					) : null}
					{this.state.imgResult ? (
						<ImageBackground
							source={{ uri: this.state.imgResult.uri }}
							style={{
								width: 300,
								alignSelf: "center",
								height: 200,
								marginTop: 10,
								marginBottom: 10,
							}}
						>
							<TouchableOpacity
								style={{
									position: "absolute",
									width: 30,
									height: 30,
									borderRadius: 50,
									right: 10,
									top: 10,
								}}
								onPress={this.handleCancelImage}
							>
								<Image
									source={require("../../aseets/images/cancel_btn.png")}
									style={{ width: 30, height: 30 }}
									width={30}
									height={30}
								/>
							</TouchableOpacity>
						</ImageBackground>
					) : null}
					<View style={{ flexDirection: "row" }}>
						{this.props.user.avatar ? (
							<Image
								source={{ uri: this.props.user.avatar }}
								style={{
									height: 55,
									alignSelf: "center",
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
									alignSelf: "center",
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
						<TextInput
							style={styles.input}
							placeholder='Write a post'
							autoCorrect={this.props.autoCorrect}
							maxLength={this.state.totalText}
							autoCapitalize={"none"}
							returnKeyType={"done"}
							editable={!this.state.loading}
							keyboardType={"default"}
							placeholderTextColor='gray'
							multiline={true}
							underlineColorAndroid='transparent'
							onChangeText={(cmnt) => {
								this.handleChangeText(cmnt)
							}}
						/>
					</View>
					<KeyboardAvoidingView
						behavior='padding'
						keyboardVerticalOffset={15}
						style={{ flex: 1, justifyContent: "flex-end" }}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								display: this.state.keyboardShown ? "flex" : "none",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-around",
									width: "50%",
								}}
							>
								<Button small dark onPress={() => this.handleChoosePhoto()}>
									<Text style={styles.btnText}>Image</Text>
								</Button>
								<Button small dark>
									<Text style={styles.btnText}>GIF</Text>
								</Button>
								<Button
									small
									dark
									onPress={() => this.props.navigation.navigate("Questions")}
								>
									<Text style={styles.btnText}>Poll</Text>
								</Button>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={styles.infoText}>
									{this.state.totalText - this.state.textContent.length}
								</Text>
								<Text style={styles.infoText}>/{this.state.totalText}</Text>
							</View>
						</View>
					</KeyboardAvoidingView>
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
						<BottomTab navigation={this.props.navigation} />
					</Animated.View>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({
	cachePosts: (posts) =>
		dispatch({
			type: ActionTypes.CACHE_POSTS,
			payload: {
				posts,
			},
		}),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(Status)

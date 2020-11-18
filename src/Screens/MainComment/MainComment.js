import React, { Component } from "react"
import {
	View,
	Text,
	TextInput,
	FlatList,
	TouchableOpacity,
	Image,
	ScrollView,
	ImageBackground,
	Animated,
	Dimensions,
	Easing,
	SafeAreaView,
	KeyboardAvoidingView,
} from "react-native"
import styles from "./styles"
import theme from "../../theme"
import { Fonts } from "../../utils/Fonts"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import BottomTab from "../../components/bottomTab"

const { height, width } = Dimensions.get("screen")

export default class CommentScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cmnt: "",
			alignment: new Animated.Value(0),
			posts: [],
			pod: null,
		}
	}

	componentDidMount = () => {
		const { pod } = this.props.navigation.state.params
		this.setState({ pod })
	}

	renderPosts = ({ item, index }) => {
		return (
			<TouchableOpacity
				key={index}
				activeOpacity={0.9}
				style={styles.cardStyle}
			>
				<View style={[styles.horizontal, { marginVertical: 5 }]}>
					<Image source={item.image} style={styles.userImgStyle} />
					<View
						style={{
							justifyContent: "space-between",
							flexDirection: "row",
							alignSelf: "center",
							width: "80%",
						}}
					>
						<View>
							<Text style={{ fontWeight: "bold" }}>{item.name}</Text>
							<Text style={{ color: "#8F92A1" }}>@saqixpro</Text>
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
						>{`${item.postedtime}`}</Text>
					</View>
				</View>
				<Text style={{ color: "#8F92A1", marginLeft: 10, marginVertical: 5 }}>
					Replying To <Text style={{ color: "rgba(81,135,220,1)" }}>@CNN</Text>
				</Text>
				<View>
					<Image
						style={styles.questionImage}
						resizeMode={"cover"}
						source={item.postImg}
					/>

					<Text style={styles.mediumText}>{item.text}</Text>
				</View>

				<View
					style={[
						styles.horizontalContainer,
						{ justifyContent: "space-between" },
					]}
				>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("CommentScreen")}
					>
						<View style={[styles.bottomContainer]}>
							<Ionicons name='ios-chatbox-outline' size={20} color='gray' />
							<Text style={{ marginLeft: 5 }}>20</Text>
						</View>
					</TouchableOpacity>
					<View style={[styles.bottomContainer]}>
						<TouchableOpacity>
							<Ionicons name='ios-heart' size={22} color='gray' />
						</TouchableOpacity>
						<Text>20</Text>
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

	liked = (_id) => {
		return false
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
				<ScrollView
					onScrollBeginDrag={() => this.animateBottomTabs(1)}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
					showsVerticalScrollIndicator={false}
					style={styles.mainContainer}
				>
					<ImageBackground
						source={{ uri: this.state.pod.image }}
						resizeMode={"cover"}
						style={[
							{
								width: width / 1.1,
								height: height / 4,
								marginVertical: 10,
								alignSelf: "center",
							},
						]}
						imageStyle={{ borderRadius: 10 }}
					/>
					<Text
						style={[styles.largeText, { width: "80%", alignSelf: "center" }]}
					>
						{this.state.pod.textContent}
					</Text>
					<TouchableOpacity>
						<Text
							style={{
								width: "80%",
								alignSelf: "center",
								color: "grey",
								fontSize: 12,
								marginVertical: 10,
							}}
						>
							{this.state.pod.sourceUrl}
						</Text>
					</TouchableOpacity>
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
						<TouchableOpacity>
							<View style={[styles.bottomContainer]}>
								<Ionicons name='ios-chatbox-outline' size={20} color='gray' />
								<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
									0
								</Text>
							</View>
						</TouchableOpacity>
						<View style={[styles.bottomContainer]}>
							{this.liked(this.state.pod.id) ? (
								<TouchableOpacity
									onPress={() => this.unlikePost(this.state.pod.id)}
								>
									<Ionicons name='ios-heart' size={20} color='red' />
								</TouchableOpacity>
							) : (
								<TouchableOpacity
									onPress={() => this.likePost(this.state.pod.id)}
								>
									<Ionicons name='ios-heart-outline' size={20} color='grey' />
								</TouchableOpacity>
							)}
							<Text style={{ marginHorizontal: 3, fontSize: 12, padding: 3 }}>
								0
							</Text>
						</View>
					</View>
					<FlatList
						data={this.state.posts}
						extraData={this.state}
						renderItem={this.renderPosts}
					/>
				</ScrollView>
				<KeyboardAvoidingView behavior='padding'>
					<View style={styles.horizontalContainer}>
						{/* <Image source={user} style={styles.postimage} /> */}
						<TextInput
							style={styles.input}
							placeholder='Reply to the post'
							autoCapitalize={"none"}
							returnKeyType={"done"}
							keyboardType={"default"}
							placeholderTextColor='gray'
							value={this.state.cmnt}
							underlineColorAndroid='transparent'
							onFocus={() => this.animateBottomTabs(1)}
							onBlur={() => this.animateBottomTabs(0)}
							onChangeText={(cmnt) => {
								this.setState({ cmnt })
							}}
						/>
						<TouchableOpacity
							style={{
								alignSelf: "center",
								marginLeft: -30,
							}}
						>
							<MaterialCommunityIcons
								name='send'
								size={25}
								color={theme.colors.primary}
							/>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
				<View
					style={{
						width: "100%",
						backgroundColor: "#fff",
						marginVertical: 10,
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

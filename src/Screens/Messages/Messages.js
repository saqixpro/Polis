import React, { Component } from "react"
import {
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
	FlatList,
	Image,
	Animated,
	Easing,
} from "react-native"
import { SearchBar } from "react-native-elements"
import styles from "./styles"
import theme from "../../theme"
import BottomTab from "../../components/bottomTab"
import firebase from "firebase"
import { connect } from "react-redux"
import Functions from "../../functions/functions"
import { FontAwesome } from "@expo/vector-icons"

class Messages extends Component {
	constructor(props) {
		super(props)
		this.state = {
			search: "",
			alignment: new Animated.Value(0),
			messages: [],
			allMessages: [],
			filteredData: [],
		}
	}
	updateSearch = (search) => {
		if (search !== "") {
			const searchData = this.state.allMessages.filter((item) =>
				item.name.toLowerCase().includes(search.toLowerCase()),
			)
			this.setState({ messages: searchData, search: search })
		} else {
			this.setState({ messages: this.state.allMessages })
		}
	}

	fetchUserConversations = async () => {
		firebase
			.database()
			.ref("chats/")
			.on("value", (snapshot) => {
				snapshot.forEach(async (conversation) => {
					const keys = conversation.key.split("_")
					const senderID = keys[0] == this.props.user.uid ? keys[1] : keys[0]
					const { user } = await Functions.fetchUserById(senderID)
					this.setState(
						{
							allMessages: [...this.state.allMessages, user],
						},
						() => this.setState({ messages: this.state.allMessages }),
					)
				})
			})
	}

	componentDidMount = async () => {
		this.fetchUserConversations()
		// try {
		//   const params = new FormData();
		//   params.append('u_id', this.props.uid);
		//   await this.props.allmessages(params);
		//   if (this.props.isSuccess) {
		//     this.setState({messages: this.props.messages});
		//   } else {
		//     //alert(this.props.errMsg);
		//   }
		// } catch (err) {
		//   console.log(err.message);
		// }
	}
	rendermembers = ({ item, index }) => {
		return (
			<TouchableOpacity
				onPress={() =>
					this.props.navigation.navigate("ChatDetail", {
						receiverID: item.id,
					})
				}
				key={index}
				style={{
					margin: 10,
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "white",
					marginVertical: 10,
					padding: 8,
				}}
			>
				{item.avatar ? (
					<Image source={{ uri: item.avatar }} style={styles.userImgStyle} />
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
							marginRight: 10,
						}}
					>
						<Text style={{ fontSize: 26, fontWeight: "bold" }}>
							{item.name ? item.name.charAt(0).toUpperCase() : "S"}
						</Text>
					</View>
				)}
				<View style={{}}>
					<Text
						style={{
							fontSize: 16,
							//  fontFamily: Fonts.FontAwesome
						}}
					>
						{item.name && item.name}
					</Text>
					<View>
						<Text
							numberOfLines={1}
							ellipsizeMode='tail'
							style={{
								fontSize: 14,
								color: "grey",
								textAlign: "left",
								width: "95%",
								// fontFamily: Fonts.FontAwesome,
							}}
						>
							{item.text}
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
			<View style={{ flex: 1, backgroundColor: "white" }}>
				<SafeAreaView />
				<SearchBar
					placeholder='Search'
					lightTheme
					placeholderTextColor={theme.colors.primary}
					onClear={() => this.setState({ messages: this.state.allMessages })}
					value={this.state.search}
					searchIcon={<FontAwesome name='search' color='#aaa' size={20} />}
					containerStyle={styles.searchContainer}
					inputContainerStyle={styles.inputStyle}
					onChangeText={(search) => {
						this.updateSearch(search)
					}}
				/>
				<FlatList
					data={this.state.messages}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
					onScrollBeginDrag={() => this.animateBottomTabs(1)}
					ItemSeparatorComponent={() => (
						<View style={{ borderBottomColor: "#ddd", borderBottomWidth: 1 }} />
					)}
					extraData={this.state}
					renderItem={this.rendermembers}
					keyExtractor={(item, index) => {
						item + index.toString()
					}}
				/>
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
const mapDispatchToProps = (dispatch) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(Messages)

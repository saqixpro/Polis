import React, { Component, useState, useEffect } from "react"
import { View, Text, SafeAreaView, Image, Animated, Easing } from "react-native"
import { SearchBar } from "react-native-elements"
import styles from "./styles"
import theme from "../../theme"
import BottomTab from "../../components/bottomTab"
import firebase from "firebase"
import { connect } from "react-redux"
import Functions from "../../functions/functions"
import { FontAwesome } from "@expo/vector-icons"
import { TouchableOpacity, FlatList } from "react-native-gesture-handler"

const RenderChat = ({ item, index, navigation }) => {
	return (
		<TouchableOpacity
			onPress={() =>
				navigation.navigate("ChatDetail", {
					receiverID: item.id,
				})
			}
			key={index}
			style={{
				margin: 10,
				flexDirection: "row",
				alignItems: "center",
				backgroundColor: "white",
				marginVertical: 5,
				padding: 5,
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

class Messages extends Component {
	state = {
		search: "",
		alignment: new Animated.Value(0),
		messages: [],
		allMessages: [],
		filteredData: [],
	}

	updateSearch = (src) => {
		if (src !== "") {
			const data = this.state.allMessages.filter((item) =>
				item.name.toLowerCase().includes(src.toLowerCase()),
			)

			this.setState({ messages: data, search: src })
		} else {
			this.setState({ messages: this.state.allMessages })
		}
	}

	fetchUserConversations = async () => {
		firebase
			.database()
			.ref("chats")
			.on("value", (snapshot) => {
				snapshot.forEach((conversation) => {
					if (conversation.key.includes(this.props.user.uid)) {
						const keys = conversation.key.split("_")
						const senderID = keys[0] == this.props.user.uid ? keys[1] : keys[0]
						firebase
							.firestore()
							.collection("users")
							.doc(senderID)
							.get()
							.then((user) => {
								const _user = { id: user.id, ...user.data() }
								this.setState(
									{
										allMessages: [
											...new Set([...this.state.allMessages, _user]),
										],
									},
									() => {
										this.setState({ messages: this.state.allMessages })
									},
								)
							})
					}
				})
			})
	}

	componentDidMount() {
		this.fetchUserConversations()
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
					onClear={() => this.setState({ messages: allMessages })}
					value={this.state.search}
					searchIcon={<FontAwesome name='search' color='#aaa' size={20} />}
					containerStyle={styles.searchContainer}
					inputContainerStyle={styles.inputStyle}
					onChangeText={(search) => {
						this.setState({ search })
					}}
				/>
				<FlatList
					data={this.state.messages}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
					onScrollBeginDrag={() => this.animateBottomTabs(1)}
					extraData={this.state}
					ItemSeparatorComponent={() => (
						<View style={{ borderBottomColor: "#ddd", borderBottomWidth: 1 }} />
					)}
					renderItem={({ item }) => (
						<RenderChat item={item} navigation={this.props.navigation} />
					)}
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

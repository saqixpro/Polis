import React, { Component } from "react"
import { View, Text, SafeAreaView, Image, Animated, Easing } from "react-native"
import styles from "./styles"
import BottomTab from "../../components/bottomTab"
import { connect } from "react-redux"
import firebase from "firebase"
import { Container, Header, Item, Icon, Input, Button } from "native-base"
import { DiscoverSkeleton } from "../../components/skeletons"
import Functions from "../../functions/functions"
import FontAwesome from "react-native-vector-icons/FontAwesome"

import { TouchableOpacity, FlatList } from "react-native-gesture-handler"

class Discover extends Component {
	constructor(props) {
		super(props)
		this.state = {
			alignment: new Animated.Value(0),
			users: [],
			allUsers: [],
			filteredData: [],
			loading: false,
		}
	}
	updateSearch = (search) => {
		const filter = search
			? this.state.allUsers.filter((user) =>
					user.name.toLowerCase().includes(search.toLowerCase()),
			  )
			: this.state.allUsers
		console.log(filter)
		this.setState({ users: filter })
	}
	componentDidMount = async () => {
		this.fetchAllUsers()
	}

	updateFollowers = async () => {
		const { users } = this.state
		for (let i = 0; i < users.length; i++) {
			const followers = await Functions.getFollowers(users[i].uid)
			users[i] = { ...users[i], followers }
		}
		this.setState({ users, allUsers: users })
	}

	fetchAllUsers = async () => {
		this.setState({ loading: true })
		const users = await firebase.firestore().collection("users").get()
		const _users = users.docs.filter(
			(user) => user.data().uid !== this.props.user.uid,
		)
		const __users = []

		await _users.map((user) => {
			__users.push({ ...user.data() })
		})

		this.setState({ users: __users, allUsers: __users, loading: false }, () =>
			this.updateFollowers(),
		)
	}

	rendermembers = ({ item, index }) => {
		return (
			<TouchableOpacity
				onPress={() =>
					this.props.navigation.navigate("ProfileStack", { uid: item.uid })
				}
				key={index}
				style={{
					margin: 10,
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "white",
				}}
			>
				{item.avatar ? (
					<Image source={{ uri: item.avatar }} style={styles.userImgStyle} />
				) : (
					<View
						style={[
							styles.userImgStyle,
							{
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "#fff",
								shadowColor: "#ccc",
								shadowOffset: {
									width: 1,
									height: 1,
								},
								shadowOpacity: 0.9,
							},
						]}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold" }}>
							{item.name.charAt(0).toUpperCase()}
						</Text>
					</View>
				)}
				<View style={{ marginLeft: 8 }}>
					<View style={{ flexDirection: "row" }}>
						<Text
							style={{
								fontSize: 16,
							}}
						>
							{item.name && item.name}
						</Text>
						{item.verifiedAccount ? (
							<FontAwesome
								style={{ marginHorizontal: 5 }}
								name='check-circle'
								size={16}
							/>
						) : null}
					</View>
					<View>
						<Text
							style={{
								fontSize: 14,
								color: "grey",
								textAlign: "left",
								// width: '95%',
								// fontFamily: Fonts.FontAwesome,
							}}
						>
							{item.followers ? item.followers.length : null}{" "}
							{item.accountType == "news" ? "Subscribers" : "Followers"}
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

		return this.state.loading ? (
			<View style={{ flex: 1, padding: 20 }}>
				<SafeAreaView />
				<DiscoverSkeleton />
			</View>
		) : (
			<Container>
				<SafeAreaView />
				<Item style={styles.searchContainer}>
					<Icon name='ios-search' style={{ color: "#8F92A1" }} />
					<Input
						placeholder='Discover'
						placeholderTextColor='#8F92A1'
						style={{ color: "#8F92A1" }}
						onChangeText={(text) => this.updateSearch(text)}
					/>
				</Item>
				<Text
					style={{
						fontSize: 16,
						width: "80%",
						alignSelf: "center",
					}}
				>
					{`All \n *`}
				</Text>
				<FlatList
					data={this.state.users}
					extraData={this.state}
					renderItem={this.rendermembers}
					onScrollBeginDrag={(e) => {
						this.animateBottomTabs(1)
					}}
					onScrollEndDrag={() => this.animateBottomTabs(0)}
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
			</Container>
		)
	}
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(Discover)

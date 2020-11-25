import React, { Component } from "react"
import { View, Text, Image, Keyboard, Alert } from "react-native"
import styles from "./styles"
import Functions from "../../functions/functions"
import { connect } from "react-redux"
import { Loader } from "../../utils/Loading"
import * as ActionTypes from "../../redux/reducers/actionTypes"
import {
	TouchableOpacity,
	TextInput,
	FlatList,
} from "react-native-gesture-handler"

class Questions extends Component {
	state = {
		poll: [
			{ id: 1, votes: [] },
			{ id: 2, votes: [] },
		],
		textContent: "",
		loading: false,
	}

	setPollVal = (id, text) => {
		let pollItem = this.state.poll.find((poll) => poll.id == id)
		pollItem = { ...pollItem, val: text }
		const updatedPoll = this.state.poll.map((poll) =>
			poll.id == id ? pollItem : poll,
		)
		this.setState({ poll: updatedPoll })
	}

	renderPolls = (item, index) => {
		const lastItem = this.state.poll.length
		const isMinimumLength = this.state.poll.length == 2 ? true : false
		return (
			<View
				style={{
					backgroundColor: "lightgrey",
					flexDirection: "row",
					marginVertical: 5,
					width: "80%",
					justifyContent: "space-between",
					borderRadius: 10,
					alignSelf: "center",
				}}
			>
				<TextInput
					style={{ padding: 12, width: "90%" }}
					onChangeText={(text) => this.setPollVal(item.id, text)}
					placeholder={`Choice ${item.id}`}
					placeholderTextColor='#222'
				/>
				{item.id == lastItem && !isMinimumLength ? (
					<TouchableOpacity
						onPress={this.handleRemoveChoice}
						style={{ padding: 5, paddingHorizontal: 10 }}
					>
						<Text style={{ fontSize: 30, fontWeight: "bold" }}>-</Text>
					</TouchableOpacity>
				) : null}
			</View>
		)
	}

	handleAddOption = () => {
		const { poll } = this.state
		const id = poll.length + 1
		const option = { id, votes: [] }
		this.setState({ poll: [...poll, option] })
	}

	handlePostPoll = async () => {
		this.setState({ loading: true })
		try {
			const data = {
				author: this.props.user.uid,
				timeStamp: Date.now(),
				expireTime: Date.now() + 86400000, // 86400000 is Worth 24 Hours so it will be holding for next 24 hours
				textContent: this.state.textContent,
				image: null,
				likes: [],
				comments: [],
				poll: this.state.poll,
				votes: 0,
			}

			if (this.state.textContent) {
				await Functions.createPost(data)
				const { posts } = await Functions.fetchPosts(this.props.user.uid)
				this.props.cachePosts(posts)
				this.setState({ loading: false })
				this.props.navigation.navigate("Home")
			} else {
				this.setState({ loading: false })
				Alert.alert(`Text Content Cannot Be Empty`)
			}
		} catch (error) {
			this.setState({ loading: false })
			console.log(error)
		}
	}

	handleRemoveChoice = () => {
		const { poll } = this.state
		poll.pop()
		this.setState({ poll })
	}

	render() {
		return (
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
						<Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
							Cancel
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonStyle}
						onPress={this.handlePostPoll}
					>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
							Post
						</Text>
					</TouchableOpacity>
				</View>
				{this.state.loading ? (
					<Loader style={styles.loading} size='small' visible={true} />
				) : null}
				<View
					style={{
						flexDirection: "row",
						padding: 10,
						marginVertical: 10,
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
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
						style={{
							width: "80%",
							fontSize: 16,
							minHeight: 70,
							color: "grey",
						}}
						placeholder="What's in your mind?"
						onChangeText={(text) => this.setState({ textContent: text })}
						multiline
					/>
				</View>
				<View style={{ marginTop: "5%" }}>
					<FlatList
						data={this.state.poll}
						renderItem={({ item }) => this.renderPolls(item)}
					/>
					<View
						style={{
							width: "100%",
							alignItems: "flex-end",
							paddingHorizontal: "10%",
						}}
					>
						<TouchableOpacity
							onPress={this.handleAddOption}
							style={{
								width: 40,
								height: 40,
								backgroundColor: "lightgrey",
								borderRadius: 50,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Text style={{ fontSize: 20, fontWeight: "bold" }}>+</Text>
						</TouchableOpacity>
					</View>
					<Text
						style={{
							//   backgroundColor: 'lightgrey',
							width: "80%",
							padding: 10,
							borderRadius: 10,
							alignSelf: "center",
							marginTop: 2,
							color: "grey",
							textAlign: "center",
						}}
					>
						Poll will be last 1 day ( 24 hours )
					</Text>
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
export default connectComponent(Questions)

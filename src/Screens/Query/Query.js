import React, { Component } from "react"
import { View, Text, Image } from "react-native"
import { Header, Rating } from "react-native-elements"
import {
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native-gesture-handler"
import HeaderCenterComponent from "../../components/HeaderCenterComponent"
import HeaderLeftComponent from "../../components/HeaderLeftComponent"
import styles from "./styles"
import theme from "../../theme"
import { user } from "../../aseets"
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import AsyncStorage from "@react-native-community/async-storage"
export default class Query extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: "Waqas Hassan",
			story: "",
			imageuri: null,
			phneuri: null,
			iuri: "",
			location: "",
			route: "recommendation",
		}
	}
	componentDidMount = async () => {
		let location = await AsyncStorage.getItem("location")
		if (location !== null) {
			this.setState({ location: location })
		} else this.setState({ location: "" })
		// return;
		// const imageuri = this.props.navigation.getParam('imageuri');
	}
	clearAsyncStorage = async () => {
		this.props.navigation.push("Home")
		alert("Satus uploaded sucessfully")
		await AsyncStorage.clear()
	}
	ratingCompleted(rating) {
		console.log("Rating is: " + rating)
	}

	render() {
		const { story } = this.state
		return (
			<View style={{ flex: 1, backgroundColor: "white" }}>
				<Header
					leftComponent={
						<HeaderLeftComponent
							icon='back'
							navigation={this.props.navigation}
						/>
					}
					centerComponent={<HeaderCenterComponent name='touristo' />}
				/>
				<View style={[styles.horizontalContainer, { marginTop: "5%" }]}>
					<Image source={user} style={styles.userImgStyle} />
					<View>
						<View style={[styles.horizontalContainer, { marginTop: "1%" }]}>
							<Text
								style={[
									styles.largeText,
									{ color: theme.colors.primary, marginRight: 5 },
								]}
							>
								{this.state.name}
							</Text>
							{!this.state.location ? (
								<Text style={(styles.mediumText, { textAlign: "center" })}>
									{"is asking about"}
								</Text>
							) : (
								<Text style={(styles.mediumText, { textAlign: "center" })}>
									is asking about{" "}
									<Text
										style={{
											color: theme.colors.primary,
											fontSize: 16,
										}}
									>
										{this.state.location}
									</Text>
								</Text>
							)}
						</View>
						<AntDesign
							name='query'
							size={30}
							color='#5BA5FF'
							//   style={{marginLeft: '5%'}}
						/>
					</View>
				</View>
				<View
					style={{
						alignItems: "center",
						// backgroundColor: 'skyblue',
					}}
				>
					<TouchableOpacity
						style={[styles.buttonStyle, { marginTop: 5 }]}
						activeOpacity={0.7}
						onPress={() =>
							this.props.navigation.navigate("Mapscreen", { recmen: "1" })
						}
					>
						<View style={styles.horizontalContainer}>
							<Entypo name='location-pin' size={32} color='red' />
							<Text
								style={[
									styles.largeText,
									{ alignSelf: "center", color: "white" },
								]}
							>
								Select Location
							</Text>
						</View>
					</TouchableOpacity>

					<TextInput
						style={styles.input}
						placeholder='Type your story here '
						keyboardType={"default"}
						placeholderTextColor='gray'
						textAlignVertical={"top"}
						multiline
						numberOfLines={4}
						value={story}
						onChangeText={(story) => {
							this.setState({ story }, () => {
								console.log(story)
							})
						}}
					/>
				</View>
				<View style={{ bottom: -170 }}>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={this.clearAsyncStorage}
					>
						<Text style={[styles.btn]}>Post</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

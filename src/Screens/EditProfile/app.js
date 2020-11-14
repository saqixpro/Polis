import {
	Body,
	Container,
	Header,
	Right,
	Content,
	Left,
	Form,
	Item,
	Label,
	Input,
	Textarea,
} from "native-base"
import React, { useState } from "react"
import { View, Text, Alert } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { connect } from "react-redux"
import styles from "./styles"
import Entypo from "react-native-vector-icons/Entypo"
import languageJSON from "../../utils/languageJSON.json"
import { Loader } from "../../utils/Loading"
import firebase from "firebase"
import * as ActionTypes from "../../redux/reducers/actionTypes"

const App = (props) => {
	const [name, setName] = useState(props.user.name)
	const [bio, setBio] = useState(props.user.bio || "")
	const [location, setLocation] = useState(props.user.location || "")
	const [website, setWebsite] = useState(props.user.website || "")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const validateUrl = () => {
		if (website) {
			const validationExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
			const isValid = validationExp.test(website)
			return isValid
		} else return true
	}

	const validateName = () => {
		const validationExp = new RegExp("(?=.{8,})")
		const isValid = validationExp.test(name)
		return isValid
	}

	const handleSave = async () => {
		const nameValid = validateName()
		const urlValid = validateUrl()

		if (nameValid)
			if (urlValid) {
				setError(null)
				const data = {
					name,
					website,
					bio,
					location,
				}

				setLoading(true)

				try {
					await firebase
						.firestore()
						.collection("users")
						.doc(props.user.uid)
						.set(data, { merge: true })
					props.updateUser(data)
					setLoading(false)
					Alert.alert(`Saved`, `Your Changes Was Saved`)
				} catch (e) {
					setLoading(false)
					Alert.alert(e.message)
				}
			} else setError(languageJSON.INVALID_URL)
		else setError(languageJSON.INVALID_NAME)
	}

	return (
		<Container>
			<Header style={{ backgroundColor: "#fff" }}>
				<Left>
					<TouchableOpacity onPress={() => props.navigation.goBack()}>
						<Entypo name='chevron-left' size={30} />
					</TouchableOpacity>
				</Left>
				<Body>
					<Text style={styles.title}>Edit Profile</Text>
				</Body>
				<Right>
					<TouchableOpacity onPress={handleSave} style={styles.saveButton}>
						<Text style={styles.save_text}>Save</Text>
					</TouchableOpacity>
				</Right>
			</Header>
			<Content>
				{loading ? <Loader visible={true} /> : null}
				{error ? <Text style={styles.error}>{error}</Text> : null}
				<Form>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>Name</Label>
						<Input onChangeText={(text) => setName(text)} defaultValue={name} />
					</Item>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>Bio</Label>
						<Input
							style={{ minHeight: 50 }}
							onChangeText={(text) => setBio(text)}
							maxLength={50}
							multiline
							defaultValue={bio}
						/>
					</Item>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>Location</Label>
						<Input
							autoCapitalize='none'
							onChangeText={(text) => setLocation(text)}
							defaultValue={location}
						/>
					</Item>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>Website</Label>
						<Input
							onChangeText={(text) => setWebsite(text.toLowerCase())}
							defaultValue={website}
						/>
					</Item>
				</Form>
			</Content>
		</Container>
	)
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({
	updateUser: (data) =>
		dispatch({
			type: ActionTypes.UPDATE_USER,
			payload: {
				bio: data.bio,
				website: data.website,
				location: data.location,
				name: data.name,
			},
		}),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(App)

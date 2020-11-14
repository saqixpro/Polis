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
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [cnfPassword, setCnfPassword] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)

	const validatePassword = () => {
		const validationExp = /^[A-Za-z]\w{6,10}$/
		const isValid = validationExp.test(newPassword)
		return isValid
	}

	const validateConfirmPassword = () => {
		const isValid = newPassword === cnfPassword
		return isValid
	}

	const handleSave = async () => {
		const passwordValid = validatePassword()
		const cnfPasswordValid = validateConfirmPassword()

		if (currentPassword == props.user.password) {
			if (passwordValid)
				if (cnfPasswordValid) {
					setLoading(true)
					try {
						await firebase.auth().currentUser.updatePassword(newPassword)
						await firebase
							.firestore()
							.collection("users")
							.doc(props.user.uid)
							.set({ password: newPassword }, { merge: true })
						props.updateUser({ passsword: newPassword })
						setLoading(false)
						Alert.alert(`Saved`, `Your Changes Was Saved`)
					} catch (e) {
						setLoading(false)
						Alert.alert(e.message)
					}
				} else setError(languageJSON.INVALID_C_PASSWORD)
			else setError(languageJSON.INVALID_PASSWORD)
		} else setError(languageJSON.INCORRECT_PASSWORD)
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
					<Text style={styles.title}>Reset Password</Text>
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
						<Label>Current Password</Label>
						<Input
							secureTextEntry
							onChangeText={(text) => setCurrentPassword(text)}
						/>
					</Item>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>New Password</Label>
						<Input
							secureTextEntry
							onChangeText={(text) => setNewPassword(text)}
						/>
					</Item>
					<Item style={styles.inputContainer} fixedLabel>
						<Label>Confirm Password</Label>
						<Input
							secureTextEntry
							onChangeText={(text) => setCnfPassword(text)}
						/>
					</Item>
				</Form>
			</Content>
		</Container>
	)
}

const mapStateToProps = (state) => ({ user: state.rootReducer.user })
const mapDispatchToProps = (dispatch) => ({
	updateUser: (password) =>
		dispatch({
			type: ActionTypes.UPDATE_PASSWORD,
			payload: {
				password,
			},
		}),
})
const connectComponent = connect(mapStateToProps, mapDispatchToProps)
export default connectComponent(App)

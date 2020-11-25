import React, { Component } from "react"
import { View, Text, SafeAreaView } from "react-native"
import styles from "./styles"
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import theme from "../../theme"
import languageJSON from "../../utils/languageJSON.json"
import { Loader } from "../../utils/Loading"
import { DatePicker } from "native-base"
import firebase from "firebase"
import {
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native-gesture-handler"

class Signup extends Component {
	state = {
		loading: false,
		name: "",
		uname: "",
		email: "",
		password: "",
		cnfpassword: "",
		dob: "",
		focus: "",
		error: "",
		passwordScreen: false,
	}

	validateEmail = () => {
		const validationExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
		const isValid = validationExp.test(this.state.email)
		return isValid
	}

	validateUserName = () => {
		// Must Be Validated From Firebase
		const isValid = true
		return isValid
	}

	validatePassword = () => {
		const validationExp = /^[A-Za-z]\w{6,10}$/
		const isValid = validationExp.test(this.state.password)
		return isValid
	}

	validateConfirmPassword = () => {
		const isValid = this.state.password === this.state.cnfpassword
		return isValid
	}

	validateName = () => {
		const validationExp = new RegExp("(?=.{8,})")
		const isValid = validationExp.test(this.state.name)
		return isValid
	}

	handleNext = () => {
		const nameValid = this.validateName()
		const emailValid = this.validateEmail()

		if (nameValid)
			if (emailValid)
				if (this.state.dob)
					this.setState({ error: null }, () =>
						this.setState({ passwordScreen: true }),
					)
				else this.setState({ error: languageJSON.INVALID_DOB })
			else this.setState({ error: languageJSON.INVALID_EMAIL })
		else this.setState({ error: languageJSON.INVALID_NAME })
	}

	signUpWithEmailAndPassword = async () => {
		this.setState({ loading: true })

		const data = {
			username: this.state.uname,
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			dateCreated: Date.now(),
			dob: this.state.dob,
			followers: [],
			following: [],
			accountType: "user",
			banned: false,
		}

		try {
			const { email, password } = this.state
			const { user } = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password)

			if (user) {
				await firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.set({ ...data, uid: user.uid })
				this.props.navigation.navigate("Login")
			}
		} catch (err) {
			this.setState({ loading: false })
			alert(err.message)
		}
	}

	handleSignUp = () => {
		const usernameValid = this.validateUserName()
		const passwordValid = this.validatePassword()
		const c_passwordValid = this.validateConfirmPassword()

		if (usernameValid)
			if (passwordValid)
				if (c_passwordValid) this.signUpWithEmailAndPassword()
				else this.setState({ error: languageJSON.INVALID_C_PASSWORD })
			else this.setState({ error: languageJSON.INVALID_PASSWORD })
		else this.setState({ error: languageJSON.INVALID_USERNAME })
	}

	render() {
		return !this.state.loading ? (
			<View style={styles.container}>
				<SafeAreaView />
				<Text style={[styles.title, styles.leftTitle]}>Sign up</Text>
				{this.state.error ? (
					<Text style={styles.error}>{this.state.error}</Text>
				) : null}
				<View
					style={{
						flex: 0.7,
						justifyContent: "center",
						display: this.state.passwordScreen ? "none" : "flex",
					}}
				>
					<View
						style={[
							styles.InputContainer,
							this.state.focus == "name" ? styles.infocus : null,
						]}
					>
						<TextInput
							style={styles.body}
							placeholder='Enter Your Name'
							onChangeText={(text) => this.setState({ name: text })}
							onFocus={() => this.setState({ focus: "name" })}
							onBlur={() => this.setState({ focus: "" })}
							placeholderTextColor={theme.colors.gray}
							underlineColorAndroid='transparent'
						/>
					</View>
					<View
						style={[
							styles.InputContainer,
							this.state.focus == "email" ? styles.infocus : null,
						]}
					>
						<TextInput
							style={styles.body}
							placeholder='Enter Email Address'
							onFocus={() => this.setState({ focus: "email" })}
							onBlur={() => this.setState({ focus: "" })}
							onChangeText={(text) => this.setState({ email: text })}
							value={this.state.phoneNo}
							placeholderTextColor={theme.colors.gray}
							underlineColorAndroid='transparent'
						/>
					</View>
					<View style={styles._inputContainer}>
						<Text style={styles.input_title}>Date of Birth</Text>
						<Text style={styles.inputDescription}>
							This is not shown publicly, Confirm your own age, even if this
							account is for a business, a pet or something else
						</Text>
						<DatePicker
							defaultDate={new Date(2018, 4, 4)}
							minimumDate={new Date(1950, 1, 1)}
							maximumDate={new Date()}
							locale={"en"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType={"slide"}
							androidMode={"default"}
							placeHolderText='Select Date of Birth'
							textStyle={{ color: "green" }}
							placeHolderTextStyle={{ color: "rgba(81,135,200,1)" }}
							onDateChange={(date) => this.setState({ dob: date })}
							disabled={false}
						/>
					</View>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={this.handleNext}
					>
						<Text style={styles.loginButtonText}> Next </Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						display: this.state.passwordScreen ? "flex" : "none",
						flex: 0.7,
						justifyContent: "center",
					}}
				>
					<View style={styles._inputContainer}>
						<Text style={styles.input_title}>Username</Text>
						<Text style={styles.inputDescription}>
							{languageJSON.USERNAME_INSTRUCTIONS}
						</Text>
						<View style={[styles.InputContainer, { marginVertical: 5 }]}>
							<TextInput
								style={styles.body}
								placeholder='Username'
								onChangeText={(text) => this.setState({ uname: text })}
								placeholderTextColor={theme.colors.gray}
								underlineColorAndroid='transparent'
							/>
						</View>
					</View>
					<View style={styles._inputContainer}>
						<Text style={styles.input_title}>Password</Text>
						<Text style={styles.inputDescription}>
							{languageJSON.PASSWORD_INSTRUCTIONS}
						</Text>
						<View style={[styles.InputContainer, { marginVertical: 5 }]}>
							<TextInput
								style={styles.body}
								secureTextEntry={true}
								placeholder='Password'
								onChangeText={(text) => this.setState({ password: text })}
								value={this.state.password}
								placeholderTextColor={theme.colors.gray}
								underlineColorAndroid='transparent'
							/>
						</View>
					</View>
					<View style={styles.InputContainer}>
						<TextInput
							style={styles.body}
							secureTextEntry={true}
							placeholder='Confirm Password'
							onChangeText={(text) => this.setState({ cnfpassword: text })}
							value={this.state.cnfpassword}
							placeholderTextColor={theme.colors.gray}
							underlineColorAndroid='transparent'
						/>
					</View>
					<TouchableOpacity
						style={styles.loginButton}
						onPress={this.handleSignUp}
					>
						<Text style={styles.loginButtonText}> Sign Up </Text>
					</TouchableOpacity>
				</View>
				<Text style={styles.or}>OR</Text>
				<View style={styles.horizontal}>
					<Text>Already Have an Account?</Text>
					<TouchableOpacity
						style={styles.trans_button}
						onPress={() => this.props.navigation.navigate("Login")}
					>
						<Text style={styles.trans_button_text}>Login</Text>
					</TouchableOpacity>
				</View>
			</View>
		) : (
			<View style={{ flex: 1 }}>
				<Loader visible={this.state.loading} />
			</View>
		)
	}
}

export default Signup

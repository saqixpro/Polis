import React, { Component } from "react"
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	Animated,
	Alert,
} from "react-native"
import styles from "./styles"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview"
import theme from "../../theme"
import firebase from "firebase"
import { Loader } from "../../utils/Loading"
import { connect } from "react-redux"
import * as ActionTypes from "../../redux/reducers/actionTypes"

class Login extends Component {
	state = {
		loading: false,
		email: "",
		password: "",
		focus: "",
		e_alignment: new Animated.Value(0),
		p_alignment: new Animated.Value(0),
	}

	animateInvalidEmail = () => {
		Animated.stagger(200, [
			Animated.spring(this.state.e_alignment, {
				toValue: 1,
				tension: 100,
				friction: 1,
			}),
			Animated.spring(this.state.e_alignment, {
				toValue: 0,
				tension: 100,
				friction: 1,
			}),
		]).start()
	}
	animateInvalidPassword = () => {
		Animated.stagger(200, [
			Animated.spring(this.state.p_alignment, {
				toValue: 1,
				tension: 100,
				friction: 1,
			}),
			Animated.spring(this.state.p_alignment, {
				toValue: 0,
				tension: 100,
				friction: 1,
			}),
		]).start()
	}

	login = async () => {
		const { email, password } = this.state
		if (email)
			if (password) {
				this.setState({ loading: true })
				try {
					const { user } = await firebase
						.auth()
						.signInWithEmailAndPassword(email, password)
					if (user) {
						firebase
							.firestore()
							.collection("users")
							.doc(user.uid)
							.get()
							.then((doc) => {
								if (doc.exists) this.props.loginUser({ ...doc.data() })
							})
					}
				} catch (e) {
					this.setState({ loading: false })
					Alert.alert(`Login Error`, e.message)
				}
			} else this.animateInvalidPassword()
		else this.animateInvalidEmail()
	}

	render() {
		const invalidEmailIntropolate = this.state.e_alignment.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 15],
		})
		const invalidPasswordIntropolate = this.state.p_alignment.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 15],
		})

		const invalidInputAnimation = {
			transform: [
				{
					translateX: invalidEmailIntropolate,
				},
			],
		}

		const invalidPasswordAnimation = {
			transform: [
				{
					translateX: invalidPasswordIntropolate,
				},
			],
		}

		return this.state.loading ? (
			<View style={{ flex: 1 }}>
				<Loader visible={this.state.loading} />
			</View>
		) : (
			<View style={styles.container}>
				<Text style={[styles.title]}>Login In</Text>
				<Animated.View
					style={[
						styles.InputContainer,
						this.state.focus == "email" ? styles.infocus : null,
						invalidInputAnimation,
					]}
				>
					<TextInput
						style={styles.body}
						placeholder='Enter Email Address'
						onChangeText={(text) => this.setState({ email: text })}
						onFocus={() => this.setState({ focus: "email" })}
						onBlur={() => this.setState({ focus: "" })}
						value={this.state.email}
						placeholderTextColor={theme.colors.gray}
						underlineColorAndroid='transparent'
					/>
				</Animated.View>
				<Animated.View
					style={[
						styles.InputContainer,
						this.state.focus == "password" ? styles.infocus : null,
						invalidPasswordAnimation,
					]}
				>
					<TextInput
						style={styles.body}
						secureTextEntry
						onFocus={() => this.setState({ focus: "password" })}
						onBlur={() => this.setState({ focus: "" })}
						placeholder='Password'
						onChangeText={(text) => this.setState({ password: text })}
						value={this.state.password}
						placeholderTextColor={theme.colors.gray}
					/>
				</Animated.View>
				<TouchableOpacity style={styles.loginButton} onPress={this.login}>
					<Text style={styles.loginButtonText}>Log in</Text>
				</TouchableOpacity>
				<Text style={styles.or}>OR</Text>
				<View style={styles.horizontal}>
					<Text>Don't Have an Account?</Text>
					<TouchableOpacity
						style={styles.trans_button}
						onPress={() => this.props.navigation.navigate("Signup")}
					>
						<Text> Sign up</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.rootReducer.user,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loginUser: (user) =>
			dispatch({
				type: ActionTypes.LOGIN_USER,
				payload: {
					user,
				},
			}),
	}
}

const connectComponent = connect(mapStateToProps, mapDispatchToProps)

export default connectComponent(Login)

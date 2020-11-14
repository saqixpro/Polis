import React, { Component } from "react"
import { View, StatusBar, ImageBackground, Alert } from "react-native"
import firebase from "firebase"
import { splash } from "../../aseets"
import styles from "./styles"
import { connect } from "react-redux"
import { Loader } from "../../utils/Loading"
import * as ActionTypes from "../../redux/reducers/actionTypes"

class Splash extends Component {
	state = {}

	componentDidMount = async () => {
		await firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("users")
					.doc(user.uid)
					.get()
					.then((doc) => {
						if (doc.exists) {
							this.props.loginUser({ ...doc.data(), uid: user.uid })
							this.props.navigation.navigate("App")
						} else
							Alert.alert(
								`Something Went Wrong on Our Side`,
								`If the error continues, please contact our support!`,
							)
					})
			} else this.props.navigation.navigate("Auth")
		})
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<StatusBar hidden={true} />
				<Loader visible={true} />
				<ImageBackground
					source={splash}
					style={styles.splashStyle}
					resizeMode={"cover"}
				/>
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

export default connectComponent(Splash)

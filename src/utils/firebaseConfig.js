import firebase from "firebase"
import "firebase/firestore"

const firebaseConfig = {
	apiKey: "AIzaSyAub0q9J5eqC56Ehu94cTNcibO4sR3zCug",
	authDomain: "social-app-5b38e.firebaseapp.com",
	databaseURL: "https://social-app-5b38e.firebaseio.com",
	projectId: "social-app-5b38e",
	storageBucket: "social-app-5b38e.appspot.com",
	messagingSenderId: "984843719225",
	appId: "1:984843719225:web:09f044ed6b5b1f3887f3e8",
}

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig)
}

import React, { useState, useEffect } from "react"
import "./src/utils/firebaseConfig"
import MainNav from "./src/navigation/MainNav"
import { ThemeProvider } from "react-native-elements"
import { Provider } from "react-redux"
import store from "./src/redux/store"
import theme from "./src/theme"

console.disableYellowBox = true

export default App = () => {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<MainNav />
			</ThemeProvider>
		</Provider>
	)
}

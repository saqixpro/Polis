import React from "react"

const sendExpoNotification = (token, title, body) => {
	try {
		let response = fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to: token,
				sound: "default",
				title: title,
				body: body,
			}),
		})
	} catch (error) {
		console.log(error)
	}
}

const sendFirebaseNotification = async (token, title, message) => {
	await fetch("https://fcm.googleapis.com/fcm/send", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `key=<FCM-SERVER-KEY>`,
		},
		body: JSON.stringify({
			to: "<NATIVE-DEVICE-PUSH-TOKEN>",
			priority: "normal",
			data: {
				experienceId: "@saqixpro/Polis",
				title: title,
				message: message,
			},
		}),
	})
}

export { sendExpoNotification, sendFirebaseNotification }

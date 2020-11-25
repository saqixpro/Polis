import firebase from "firebase"
import { Alert } from "react-native"
export default class Functions {
	static followUser(currentUserId, userToBeFollowedID) {
		return new Promise(async (resolve) => {
			// currentUser
			const currentUser = await firebase
				.firestore()
				.collection("users")
				.doc(currentUserId)
				.get()
			// currentUser following
			let following = currentUser.data().following
			following.push(userToBeFollowedID)
			following = new Set(following)
			following = [...following]
			currentUser.ref.set({ following }, { merge: true })

			resolve(true)
		})
	}

	static unfollowUser(currentUserId, userToBeUnFollowedID) {
		return new Promise(async (resolve) => {
			// currentUser
			const currentUser = await firebase
				.firestore()
				.collection("users")
				.doc(currentUserId)
				.get()
			// currentUser following
			let following = currentUser
				.data()
				.following.filter((id) => id !== userToBeUnFollowedID)
			currentUser.ref.set({ following }, { merge: true })

			resolve(true)
		})
	}

	static getFollowers(userID) {
		return new Promise(async (resolve) => {
			const followers = await firebase
				.firestore()
				.collection("users")
				.where("following", "array-contains", userID)
				.get()
			const { docs } = followers
			resolve(docs)
		})
	}

	static createPost(data) {
		return new Promise((resolve, reject) => {
			firebase
				.firestore()
				.collection("posts")
				.add(data)
				.then(() => {
					resolve(true)
				})
				.catch((err) => reject(err.message))
		})
	}

	static fetchPosts() {
		return new Promise(async (resolve) => {
			try {
				let _posts = []
				const posts = await firebase
					.firestore()
					.collection("posts")
					.orderBy("timeStamp", "desc")
					.limit(20)
					.get()
				posts.docs.map((post) => _posts.push({ ...post.data(), id: post.id }))

				for (let i = 0; i < _posts.length; i++) {
					const author = await firebase
						.firestore()
						.collection("users")
						.doc(_posts[i].author)
						.get()

					let comments = await firebase
						.firestore()
						.collection("comments")
						.where("postID", "==", _posts[i].id)
						.get()

					comments = comments.docs.map((cmt) => ({ id: cmt.id, ...cmt.data() }))

					_posts[i] = {
						..._posts[i],
						author: { id: _posts[i].author, ...author.data() },
						comments,
					}
				}

				resolve({ posts: _posts })
			} catch (error) {
				console.log(error)
			}
		})
	}

	static fetchNewsPosts() {
		return new Promise(async (resolve) => {
			try {
				let _posts = []
				const posts = await firebase
					.firestore()
					.collection("posts")
					.where("type", "==", "news")
					.limit(20)
					.get()
				posts.docs.map((post) => _posts.push({ ...post.data(), id: post.id }))

				for (let i = 0; i < _posts.length; i++) {
					const author = await firebase
						.firestore()
						.collection("users")
						.doc(_posts[i].author)
						.get()
					_posts[i] = {
						..._posts[i],
						author: { id: _posts[i].author, ...author.data() },
					}
				}

				resolve({ posts: _posts })
			} catch (error) {
				console.log(error)
			}
		})
	}

	// static fetchPosts(userID){
	//     return new Promise(async resolve => {
	//         const currentUser = await firebase.firestore().collection('users').doc(userID).get();
	//         const following = currentUser.data().following;
	//         const _posts = [];
	//         try{
	//         let posts = await firebase.firestore().collection('posts').where('author', '==', userID).get();
	//         posts.docs.map(doc => _posts.push({id: doc.id, ...doc.data()}))

	//         for(let i = 0; i < following.length; i++){
	//             const posts = await firebase.firestore().collection('posts').where('author', '==', following[i]).get()
	//             posts.docs.map(doc => _posts.push({...doc.data(), id: doc.id}))
	//         }
	//         // fetch Author's Info For Each Post
	//         for(let i = 0; i < _posts.length; i++){
	//             const author = await firebase.firestore().collection('users').doc(_posts[i].author).get();
	//             _posts[i] = {..._posts[i], author: {id: _posts[i].author, ...author.data()} }
	//         }

	//         const __posts = _posts.sort((a, b) => {
	//             return a.timeStamp > b.timeStamp ? -1 : b.timeStamp > a.timeStamp ? 1 : 0;
	//         })

	//         resolve({posts: __posts});
	//     } catch(error) {
	//         console.log(error);
	//     }
	//     })
	// }

	static likePost(id, userID) {
		return new Promise(async (resolve) => {
			const post = await firebase.firestore().collection("posts").doc(id).get()
			const likes = post.data().likes
			post.ref.set({ likes: [...likes, userID] }, { merge: true })
			resolve(true)
		})
	}

	static unlikePost(id, userID) {
		return new Promise(async (resolve) => {
			const post = await firebase.firestore().collection("posts").doc(id).get()
			let likes = post.data().likes
			likes = likes.filter((_id) => _id !== userID)
			post.ref.set({ likes }, { merge: true })
			resolve(true)
		})
	}

	static fetchTrendingPosts() {
		return new Promise(async (resolve) => {
			try {
				const posts = await firebase
					.firestore()
					.collection("posts")
					.orderBy("likes", "desc")
					.limit(5)
					.get()
				const _posts = []
				posts.docs.map((post) => _posts.push({ id: post.id, ...post.data() }))
				resolve({ posts: _posts })
			} catch (error) {
				console.log(error)
			}
		})
	}

	static fetchPostsByUser(id) {
		return new Promise(async (resolve) => {
			try {
				const posts = await firebase
					.firestore()
					.collection("posts")
					.where("author", "==", id)
					.get()
				const _posts = []
				posts.docs.map((post) => _posts.push({ id: post.id, ...post.data() }))
				resolve({ posts: _posts })
			} catch (error) {
				console.log(error)
			}
		})
	}

	static castVote(userID, postID, optionID) {
		return new Promise(async (resolve) => {
			try {
				const post = await firebase
					.firestore()
					.collection("posts")
					.doc(postID)
					.get()
				const updatedPoll = post
					.data()
					.poll.map((poll) =>
						poll.id == optionID
							? { ...poll, votes: [...poll.votes, userID] }
							: poll,
					)
				post.ref.set(
					{ poll: updatedPoll, votes: post.data().votes + 1 },
					{ merge: true },
				)
				resolve(true)
			} catch (error) {
				console.log(error)
			}
		})
	}

	static voteAlreadyCasted(userID, postID) {
		return new Promise(async (resolve) => {
			try {
				const post = await firebase
					.firestore()
					.collection("posts")
					.doc(postID)
					.get()
				const options = post.data().poll
				let verified
				for (let i = 0; i < options.length; i++) {
					verified = options[i].votes.find((id) => id == userID)

					if (verified) resolve({ casted: true })
				}
				resolve({ casted: false })
			} catch (error) {
				console.log(error)
			}
		})
	}

	static fetchPostOfTheDay() {
		return new Promise(async (resolve) => {
			try {
				const pod = await firebase
					.firestore()
					.collection("pod")
					.doc("pod")
					.get()
				resolve({ pod: { id: pod.id, ...pod.data() } })
			} catch (err) {
				console.log(err.message)
			}
		})
	}

	static fetchUserById(id) {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await firebase
					.firestore()
					.collection("users")
					.doc(id)
					.get()
				const _user = { ...user.data(), id: user.id }
				if (user.exists) resolve({ user: _user })
				else reject(`User Not Found`)
			} catch (error) {
				console.log(error)
			}
		})
	}

	static makeComment(data) {
		return new Promise(async (resolve) => {
			try {
				firebase
					.firestore()
					.collection("comments")
					.add(data)
					.then(() => {
						resolve(true)
					})
			} catch (error) {
				console.log(error)
			}
		})
	}
}

import * as ActionTypes from "./actionTypes"
const initialState = {
	user: {
		username: "Guest",
	},
	posts: [],
}

export const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.LOGIN_USER:
			return { ...state, user: action.payload.user }
		case ActionTypes.UPDATE_USER:
			return {
				...state,
				user: {
					...state.user,
					bio: action.payload.bio,
					location: action.payload.location,
					website: action.payload.website,
					name: action.payload.name,
				},
			}
		case ActionTypes.UPDATE_PASSWORD:
			return {
				...state,
				user: { ...state.user, password: action.payload.password },
			}
		case ActionTypes.FOLLOW_USER:
			const following = [...state.user.following, action.payload.id]
			return { ...state, user: { ...state.user, following } }
		case ActionTypes.UNFOLLOW_USER:
			const filter = state.user.following.filter(
				(id) => id !== action.payload.id,
			)
			return { ...state, user: { ...state.user, following: filter } }
		case ActionTypes.CACHE_POSTS:
			return { ...state, posts: action.payload.posts }
		case ActionTypes.MAKE_COMMENT:
			const _updated_Posts = state.posts.map((post) =>
				post.id == action.payload.id ? action.payload.data : post,
			)
			return { ...state, posts: _updated_Posts }
		default:
			return state
	}
}

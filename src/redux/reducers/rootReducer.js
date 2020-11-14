import * as ActionTypes from './actionTypes'
const initialState = {
 user: {
   username: "Guest"
 },
 posts: []
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_USER:
      return {...state, user: action.payload.user};
    case ActionTypes.UPDATE_USER:
        return {...state, user: {...state.user, bio: action.payload.bio, location: action.payload.location, website: action.payload.website, name: action.payload.name}}
    case ActionTypes.UPDATE_PASSWORD:
        return {...state , user: {...state.user, password: action.payload.password}}
    case ActionTypes.FOLLOW_USER:
        const following = [...state.user.following, action.payload.id];
        return {...state, user: {...state.user, following}}
    case ActionTypes.UNFOLLOW_USER:
      const filter = state.user.following.filter(id => id !== action.payload.id);
      return {...state , user: {...state.user, following: filter }}
      case ActionTypes.CACHE_POSTS:
        return {...state, posts: action.payload.posts}
      case ActionTypes.LIKE_POST:
        const _post = state.posts.find(post => post.id == action.payload.id);
        const _updatedPost = {..._post, likes: [..._post.likes, action.payload.userID]};
        const updatedPosts = state.posts.map(post => post.id == action.payload.id ? _updatedPost : post);
        return {...state, posts: updatedPosts}
      case ActionTypes.UNLIKE_POST:
        const __post = state.posts.find(post => post.id == action.payload.id);
        const __updatedPost = {...__post, likes: __post.likes.filter(id => id !== action.payload.userID)};
        const _updatedPosts = state.posts.map(post => post.id == action.payload.id ? __updatedPost : post);
        return {...state, posts: _updatedPosts}
      case ActionTypes.CAST_VOTE:
        const poll_post = state.posts.find(post => post.id == action.payload.postID);
        const updated_poll =  poll_post.poll.map(option => option.id == action.payload.optionID ? {...option, votes: [...option.votes, action.payload.userID]} : option)
        const updated_poll_post = {...poll_post, poll: updated_poll, votes: poll_post.votes + 1};
        const updated_posts = state.posts.map(post => post.id == action.payload.postID ? updated_poll_post : post);
        return {...state, posts: updated_posts};
      // case ActionTypes.MAKE_COMMENT:
      //   const _current_post = state.posts.find(post => post.id == action.payload.id);
      //   const _current_post_comments = [..._current_post.comments, action.payload.data];
      //   const _updated_current_post = {..._current_post, comments: _current_post_comments};
      //   const _updated__Posts = state.posts.map(post => post.id == action.payload.id ? _updated_current_post : post);
      //   return {...state, posts: _updated__Posts};
      case ActionTypes.MAKE_COMMENT:
           const _updated_Posts = state.posts.map(post => post.id == action.payload.id ? action.payload.data : post );
           return {...state, posts: _updated_Posts};
        default:
      return state;
  }
};

export const favoriteBlogs = (state = [], action) => {
  switch (action.type) {
    case 'FAV_BLOG_SENT': {

      if(state.findIndex((blog) => blog.id === action.payload.id) !== -1)
      {
        console.log('Already in state',{payload: action.payload, state})
        return state;
      }

      return [...state, action.payload]
    }
    default:
      return state;
  }};
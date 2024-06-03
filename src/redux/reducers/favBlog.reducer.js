export const favoriteBlogs = (state = [], action) => {
  switch (action.type) {
    case 'FAV_BLOG_SENT': {
      const blogIDX = state.findIndex((blog) => blog.id === action.payload.id);
      if( blogIDX !== -1)
      {
        console.log('Fav Already in state',{payload: action.payload, state})
        state[blogIDX] = action.payload;
        console.log('Updated Fav state', state)
        return state;
      }

      return [...state, action.payload]
    }
    case 'FAV_BLOGS_SENT': {
      state = action.payload;
      return state;
    }
    case 'FAV_BLOG_ADDED': {
      const blogIDX = state.findIndex((blog) => blog.id === action.payload.id);
      if( blogIDX !== -1)
      {
        console.log('Found fav in state',{payload: action.payload, state})
        state[blogIDX] = action.payload;
        console.log(`Deleted ${blogIDX} from Fav state`, state)
        return [...state];
      }

      if(action.payload.id === undefined) {
        console.log('Bad Blog', action.payload);
        return [...state];
      }

      return [...state, action.payload]
    }

    case 'FAV_BLOG_DELETED': {
      const blogIDX = state.findIndex((blog) => blog.id === action.payload.id);
      if( blogIDX !== -1)
      {
        console.log('Found fav in state',{payload: action.payload, state})
        state.splice(blogIDX, 1);
        console.log(`Deleted ${blogIDX} from Fav state`, state)
      }

      return [...state];
    }
    default:
      return state;
  }};
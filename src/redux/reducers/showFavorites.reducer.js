export const showFavorites = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_FAVORITES': {
       return action.payload;
    }
    default:
      return state;
  }};
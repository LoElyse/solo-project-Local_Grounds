export const showInfo = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_INFO': {
      return action.payload;
    }
    default:
      return state;
  }};
export const searchPlace = (state = [], action) => {
  switch (action.type) {
    case 'SEARCH_PLACE':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};// const search = (state = [], action) => {
//   switch (action.type) {
//     case 'SET_SEARCH':
//       return action.payload;
//     default:
//       return state;
//   }
// }
//
// export default search;
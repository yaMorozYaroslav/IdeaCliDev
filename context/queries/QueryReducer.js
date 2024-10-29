import {SET_CATEGORY,SET_TYPE, SET_SEARCH, 
	                   SET_PAGE, RESET, SET_REVERSE} from "./QueryTypes"

const QueryReducer = (state, action) => {
  switch (action.type) {
	  
	case SET_CATEGORY:
	  return {...state, category: action.payload}
	case SET_TYPE:
	  return {...state, type: action.payload}
	case SET_PAGE:
	  return {...state, page: action.payload}
    case SET_SEARCH:
      return {...state, search: action.payload}
    case SET_REVERSE:
      return {...state, reverse: action.payload}
    case RESET:
      return action.payload
   
    default:
      return state;
  }
}

export default QueryReducer;

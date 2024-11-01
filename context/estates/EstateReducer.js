import {GET_ESTATES, START_LOADING, END_LOADING, ADD_ESTATE, 
	    UPDATE_ESTATE, REMOVE_ESTATE, ERROR, RESET} from "./EstateTypes"

const EstateReducer = (state, action) => {
  switch (action.type) {
	  
	case GET_ESTATES:
	  return {...state, estates: action.payload }
		  
	case START_LOADING:
	return{...state,loading: true}
	case END_LOADING:
	return{...state,loading: false}

  
    case ADD_ESTATE:
       return state
       //~ if(!state.seeds.data){return {...state, seeds:  [...state.seeds, action.payload]}
	    //~ }else{return {...state, seeds: {...state.seeds,
	                  //~ data: [...state.seeds.data, action.payload]}  }}
		                
		                
    case UPDATE_ESTATE: 
       return state
      //~ if(!state.seeds.data){return {...state, seeds: action.payload}
    //~ }else{return{...state, seeds: {...state.seeds, 
			 //~ data: state.seeds.data.map((seed) =>
         //~ (seed._id === action.payload._id ? action.payload : seed))}  }}

    case REMOVE_ESTATE:
       return state
    //~ console.log(action.payload)
      //~ if(!state.seeds.data){return state
     //~ }else{return {...state, seeds: {...state.seeds,
		                   //~ data: state.seeds.data.filter((item) =>
			                       //~ item._id !== action.payload._id)}  }}
    case ERROR:
	return{...state, error: action.payload, loading: false}
	
	case RESET: 
	return action.payload
	
    default:
      return state;
  }
}

export default EstateReducer;

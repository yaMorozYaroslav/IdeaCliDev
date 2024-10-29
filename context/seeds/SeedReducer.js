import {GET_SEEDS, START_LOADING, END_LOADING, ADD_SEED,
	    UPDATE_SEED, REMOVE_SEED, ERROR, RESET} from "./SeedTypes"

const SeedReducer = (state, action) => {
  switch (action.type) {
	  
	case GET_SEEDS:
	  return {...state, seeds: action.payload }
		  
	case START_LOADING:
	return{...state,loading: true}
	case END_LOADING:
	return{...state,loading: false}

  
    case ADD_SEED:
       return state
       //~ if(!state.seeds.data){return {...state, seeds:  [...state.seeds, action.payload]}
	    //~ }else{return {...state, seeds: {...state.seeds,
	                  //~ data: [...state.seeds.data, action.payload]}  }}
		                
		                
    case UPDATE_SEED: 
       return state
      //~ if(!state.seeds.data){return {...state, seeds: action.payload}
    //~ }else{return{...state, seeds: {...state.seeds, 
			 //~ data: state.seeds.data.map((seed) =>
         //~ (seed._id === action.payload._id ? action.payload : seed))}  }}

    case REMOVE_SEED:
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

export default SeedReducer;

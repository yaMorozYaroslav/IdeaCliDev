import {REMOVE_ITEM, ADD_TO_CART, INCREASE,
        DECREASE, FROM_LOCALE, CLEAR, SET_TOTAL} from "./CartTypes";


const CartReducer = (state, action) => {
  
  switch (action.type) {
    
    case ADD_TO_CART:
    
    const itemInCart = state.cartItems.find(item => item._id === action.payload._id)
    
	  if(itemInCart){ 
		  return {...state, cartItems: 
		         state.cartItems.map((item) =>
                       item._id === action.payload._id 
                           ? {...action.payload, quantity: item.quantity++} 
                           : item)}}
      
      return {...state, cartItems: [...state.cartItems, 
		                         ({ ...action.payload, quantity: 1 })]}
     
     
    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: [
          ...state.cartItems.filter((item) => 
                                  item._id !== action.payload)]
      }

      case INCREASE:
      
      return {...state, cartItems: state.cartItems.map((item) =>
                       (item._id === action.payload)
                            ?{...item, quantity: item.quantity + 1}
                            :item)}
      

   case DECREASE:
      
      return {...state, cartItems: state.cartItems.map((item) =>
                       (item._id === action.payload)
                            ?{...item, quantity: item.quantity>1?item.quantity-1:1}
                            :item)}

   case FROM_LOCALE:
      return {
        cartItems: action.payload
      };

    case CLEAR:
      return {
        cartItems: []
      };
    case SET_TOTAL:
      return { 
		 ...state, cartTotal: action.payload
		  }

    default:
      return state
  }
};

export default CartReducer

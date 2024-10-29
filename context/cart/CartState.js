'use client'
import { useReducer,useContext, createContext } from "react"
import CartReducer from "./CartReducer"

import {REMOVE_ITEM, ADD_TO_CART, INCREASE,
        DECREASE, FROM_LOCALE, CLEAR, SET_TOTAL} from "./CartTypes";

 const CartContext = createContext()

export const CartState = ({ children }) => {

  const [state, dispatch] = useReducer(CartReducer, {cartItems:[], cartTotal: 0})

  const addToCart = (payload) => {
    dispatch({ type: ADD_TO_CART, payload })
  }

  const increase = (payload) => {
    dispatch({ type: INCREASE, payload });
  };

  const decrease = (payload) => {
    dispatch({ type: DECREASE, payload });
  };

  const removeFromCart = (payload) => {
    dispatch({ type: REMOVE_ITEM, payload });
  };

  
  const clearCart = () => {
    dispatch({ type: CLEAR });
  };
  const setFromLocale =(source)=> {
		dispatch({type: FROM_LOCALE, payload: source})
		}
  const setTotal =(source)=> {dispatch({type: SET_TOTAL, payload: source})}

  return (
     <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        addToCart,
        removeFromCart,
        increase,
        decrease,
        clearCart,
        setFromLocale,
        setTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCartContext = () => useContext(CartContext)

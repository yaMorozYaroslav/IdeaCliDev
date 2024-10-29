'use client'
import { useReducer, useContext, createContext } from "react"
import ItemReducer from "./ItemReducer";
import {getItems, createItem, editItem, deleteItem} from '../../api'

import {GET_ITEMS, START_LOADING, END_LOADING, ADD_ITEM, 
	    UPDATE_ITEM, REMOVE_ITEM, ERROR, RESET} from "./ItemTypes"

const ItemContext = createContext()

export const ItemState = ({ children }) => {
  
  const initialState = {
    items: [],
    loading: false, 
    error: []
  };

  const [state, dispatch] = useReducer(ItemReducer, initialState)

  const fetchItems = async(sos) => {
	try{
		dispatch({type: START_LOADING})
		//console.log(sos)
		const {data} = await getItems(sos.category, sos.type, sos.page,
		                              sos.search, sos.reverse)
		//console.log(data)
		dispatch({type: GET_ITEMS, payload: data})
		
		dispatch({type: END_LOADING})
	 }
	catch(err){	
		dispatch({type: ERROR, payload: err.message})
	  }
   }
  
  const addItem = async(source) => {
    try{
		const {data} = await createItem(source)
		dispatch({type: ADD_ITEM, payload: data})
	 }
    catch(err){
    	dispatch({type: ERROR, payload: err})
    }
  };

  const updateItem = async (id, source) => {
	  try{
		  const {data} = await editItem(id, source)
		  //console.log(data)
		  dispatch({type: UPDATE_ITEM, payload: data})
		  }
	  catch(err){
		dispatch({type: ERROR, payload: err})
	   }
	  }

   const removeItem = async(id) => {
	try{
		const {data} = await deleteItem(id)
		console.log(data)
		dispatch({type: REMOVE_ITEM, payload: data})
	 }
	catch(err){
		dispatch({type: ERROR, payload: err})
	}
   }
   const resetItems = () => {dispatch({type: RESET, payload: initialState})}

  return (

    <ItemContext.Provider
      value={{
        items: state.items,
        loadingItems: state.loading,
        error: state.error,
        fetchItems,
        addItem,
        updateItem,
        removeItem,
        resetItems,
        ...state,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};
export const useItemContext = () => useContext(ItemContext)

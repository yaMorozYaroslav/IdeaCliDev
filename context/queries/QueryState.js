'use client'
import React,{useContext} from 'react'
import { useReducer } from "react"
import QueryReducer from "./QueryReducer"

import {SET_CATEGORY, SET_TYPE, SET_SEARCH, RESET,
                      SET_PAGE, SET_REVERSE, ERROR} from "./QueryTypes"

const QueryContext = React.createContext()

export const QueryState = ({ children }) => {
  
  const initialState = {
    category: '',
    type: '',
    page: 1,
    search: '',
    reverse: false
  };

  const [state, dispatch] = useReducer(QueryReducer, initialState)

  const setCategory = (source) => {
	try{
		dispatch({type: SET_CATEGORY, payload: source})
		if(!source)dispatch({type: SET_TYPE, payload: source})
	 }
	catch(err){	
		console.log(err)
	  }
   }
   const setType = (source) => {
	   try{
		   dispatch({type: SET_TYPE, payload: source})
		   }
	   catch(err){	
		console.log(err)
	  }
	   }
   const setPage = (source) => {
	   try{
		   dispatch({type: SET_PAGE, payload: source})
		   }
	   catch(err){	
		console.log(err)
	  }
	   }
  
  const setSearch = (source) => {
    try{
		dispatch({type: SET_SEARCH, payload: source})
	 }
    catch(err){
    	
    	console.log(err)
    }
  }
  
  const setReverse = (source) => {
	  try{
	     dispatch({type: SET_REVERSE, payload: source})
	   }
	    catch(err){
    	console.log(err)
	 }
   }
   
  
  const reset = () => {
	  dispatch({type: RESET, payload: initialState})
	  //~ console.log(state)
	  }

 
  return (

    <QueryContext.Provider
      value={{
        state,
        category: state.category,
        type: state.type,
        page: state.page,
        search: state.search,
        reverse: state.reverse,
        setType,
        setCategory,
        setPage,
        setSearch,
        setReverse,
        reset
      }}
    >
      {children}
    </QueryContext.Provider>
  );
};
export const useQueryContext = () => useContext(QueryContext)

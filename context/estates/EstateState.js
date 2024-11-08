'use client'
import { useReducer, useContext } from "react";
import React from "react";
import EstateReducer from "./EstateReducer";
import {getEstates, createEstate, editEstate, deleteEstate} from '../../api'

import {GET_ESTATES, START_LOADING, END_LOADING, ADD_ESTATE, 
	    UPDATE_ESTATE, REMOVE_ESTATE, ERROR, RESET, SET_MANUALLY} from "./EstateTypes"

const EstateContext = React.createContext()

export const EstateState = ({ children }) => {
  
  const initialState = {
    estates: [],
    loading: false, 
    error: []
  };
 
  const [state, dispatch] = useReducer(EstateReducer, initialState)

  const fetchEstates = async(sos) => {
	try{
		dispatch({type: START_LOADING})
		
		const {data} = await getEstates(sos.location, sos.page)
		
		dispatch({type: GET_ESTATES, payload: data})
		
		dispatch({type: END_LOADING})
	 }
	catch(err){	
		dispatch({type: ERROR, payload: err.message})
	  }
   }
  
  const addEstate = async(source) => {
    try{
		const {data} = await createEstate(source)
		//const newData = (!category||category===data.category)&&
		//                (!type||type===data.type)?data:null
		console.log(data)
		dispatch({type: ADD_ESTATE, payload: data})
	 }
    catch(err){
    	dispatch({type: ERROR, payload: err})
    }
  };

  const updateEstate = async (id, source) => {
	  try{
		  const {data} = await editEstate(id, source)
		  //console.log(data)
		  dispatch({type: UPDATE_ESTATE, payload: data})
		  }
	  catch(err){
		dispatch({type: ERROR, payload: err})
	   }
	  }

   const removeEstate = async(id) => {
	try{
		const {data} = await deleteEstate(id)
		console.log(data)
		dispatch({type: REMOVE_ESTATE, payload: data})
	 }
	catch(err){
		dispatch({type: ERROR, payload: err})
	}
   }
   const resetEstates = () => {dispatch({type: RESET, payload: initialState})}
   const setEstates = (data) => {dispatch({type: SET_MANUALLY, payload: data})}
  return (

    <EstateContext.Provider
      value={{
        estates: state.seeds,
        loadingEstates: state.loading,
        error: state.error,
        fetchEstates,
        addEstate,
        updateEstate,
        removeEstate,  
        resetEstates,
        setEstates,
        ...state
      }}>
      {children}
    </EstateContext.Provider>
  );
};
export const useEstateContext = () => useContext(EstateContext)

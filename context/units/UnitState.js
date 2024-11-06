'use client'
import { useReducer, useContext, createContext } from "react"
import UnitReducer from "./UnitReducer";
import {getEstateUnits, createUnit, editUnit, deleteUnit} from '../../api'

import {GET_E_U, START_LOADING, END_LOADING, ADD_UNIT, 
	    UPDATE_UNIT, REMOVE_UNIT, ERROR, RESET} from "./UnitTypes"

const UnitContext = createContext()

export const UnitState = ({ children }) => {
  
  const initialState = {
    units: [],
    loading: false, 
    error: []
  };

  const [state, dispatch] = useReducer(UnitReducer, initialState)

  const fetchEstateUnits = async(sos) => {
	try{
		dispatch({type: START_LOADING})
		//console.log(sos)
		const {data} = await getEstateUnits(sos.estateID, sos.page)
		//console.log(data)
		dispatch({type: GET_E_U, payload: data})
		
		dispatch({type: END_LOADING})
	 }
	catch(err){	
		dispatch({type: ERROR, payload: err.message})
	  }
   }
  
  const addUnit = async(estateID, source) => {
    try{
		const {data} = await createUnit(estateID, source)
		dispatch({type: ADD_UNIT, payload: data})
	 }
    catch(err){
    	dispatch({type: ERROR, payload: err})
    }
  };

  const updateUnit = async (id, source) => {
	  try{
		  const {data} = await editUnit(id, source)
		  //console.log(data)
		  dispatch({type: UPDATE_UNIT, payload: data})
		  }
	  catch(err){
		dispatch({type: ERROR, payload: err})
	   }
	  }

   const removeUnit = async(id) => {
	try{
		const {data} = await deleteUnit(id)
		console.log(data)
		dispatch({type: REMOVE_UNIT, payload: data})
	 }
	catch(err){
		dispatch({type: ERROR, payload: err})
	}
   }
   const resetUnits = () => {dispatch({type: RESET, payload: initialState})}

  return (

    <UnitContext.Provider
      value={{
        units: state.units,
        loadingUnits: state.loading,
        error: state.error,
        fetchEstateUnits,
        addUnit,
        updateUnit,
        removeUnit,
        resetUnits,
        ...state,
      }}
    >
      {children}
    </UnitContext.Provider>
  );
};
export const useUnitContext = () => useContext(UnitContext)

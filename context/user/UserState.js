'use client'

import React, {createContext, useContext, useState} from 'react'
import {register, auth} from '../../api'
import {UserReducer} from './UserReducer'
import {AUTH, LOGOUT, FROM_STORAGE, ERROR, NO_ERROR} from './UserTypes'

const UserContext = createContext()

export const UserState = ({children}) => {
	
   const initialState = {userData: {}, loading: false, error: null}
   
   const [state, dispatch] = React.useReducer(UserReducer, initialState)
	
	
	const signUp = async(source) => {
		try{
		dispatch({type: 'START_LOADING'})
		const {data} = await register(source)
        dispatch({type: AUTH, payload: data})
        dispatch({type: 'END_LOADING'})
    }catch(err){dispatch({type: ERROR, payload: 
			       err.response?err.response.data.message:err.message})}
	    }
		
	const signIn = async(source) => {
		try{
		dispatch({type: 'START_LOADING'})
		const {data}= await auth(source)
		dispatch({type: AUTH, payload: data})
		dispatch({type: 'END_LOADING'})
	}catch(err){dispatch({type: ERROR, payload:
			       err.response?err.response.data.message:err.message})}
		}
	const setFromStorage =(source)=> {
		dispatch({type: FROM_STORAGE, payload: source})
		}
		
    const logout = () => {
		dispatch({type: LOGOUT})
		}
		
	const clearError = () => dispatch({type: NO_ERROR})
	
	return (

    <UserContext.Provider
      value={{userData: state.userData, error: state.error, signUp,
		                signIn, logout, setFromStorage, clearError}}>
      {children}
    </UserContext.Provider>
  )
	}
export const useUserContext = () => useContext(UserContext)

'use client'
import React, {createContext, useContext, useState} from 'react'

const LoadContext = createContext()

export const LoadState = ({children}) => {
	
	const [loading, setLoading] = useState(false)
	
	//~ const switchLoad = () => {setLoading(!loading)}
	
	return (<LoadContext.Provider value={{loading, setLoading}}>
	                                   {children}</LoadContext.Provider>)
	}
	
 export const useLoadContext = () => useContext(LoadContext)

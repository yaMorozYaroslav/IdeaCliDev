'use server'
import {register, auth} from './api'
import {cookies} from 'next/headers'

export const signIn = async(formData)=> {
	const session = await auth(formData)
	const stringified = JSON.stringify(session.data)
	cookies().set('session', stringified)
	return session.data
	} 
export const signUp = async(formData)=> {
	const session = await register(formData)
	const stringified = JSON.stringify(session.data)
	cookies().set('session', stringified)
	return session.data
	}
//~ export const getSession =async()=> {
	//~ const session = await cookies().get('session').value
	//~ return session}
export const logOut =async()=> await cookies().delete('session')

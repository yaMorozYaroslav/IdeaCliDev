'use server'
import {register, auth} from './api'
import {cookies} from 'next/headers'

export const signIn = async(formData)=> {
	const session = await auth(formData)
	const stringified = JSON.stringify(session.data)
	await cookies().set('session', stringified)
	return session.data
	} 
export const signUp = async(formData)=> {
	const session = await register(formData)
	const stringified = JSON.stringify(session.data)
	await cookies().set('session', stringified)
	return session.data
}
//~ export const getReadySession =async()=> {
	//~ let session = '{}'
	//~ if(cookies().get('session')) return cookies().get('session').value
	//~ return session
	//~ }
export async function getSession() {
	let session = '{}'
	const sesCooks = await cookies().get('session')
	if(sesCooks) return sesCooks.value
	return session
	}
export const logOut =async()=> {await cookies().delete('session')
	                            return {}}

'use server'
import {AuthForm} from '../../../comps/AuthForm/AuthForm'
import { cookies } from 'next/headers'

export default async function Auth(){
	//~ const cookieStore = await cookies()
	//~ console.log(cookieStore.get('session'))
	
	//~ console.log(cookieStore)
	return <><AuthForm /></>
	}

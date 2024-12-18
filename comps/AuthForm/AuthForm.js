'use client'
import React from 'react'
import * as S from './auth-form.styled'
import {Label} from './auth-form.styled'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

//~ import {useUserContext} from '../../context/user/UserState'
import {signIn, signUp} from '/lib'
import {sendEmail} from '/api'
import cookies from 'js-cookie';

const initialState = {name: '', email: '', password: '', confPass: '', role: ''}

export function AuthForm(){
	const router = useRouter()
	
	//~ const {setFromStorage, error, clearError} =  useUserContext()
    const [userData, setUserData] = React.useState()        
	const [source, setSource] = React.useState(initialState)
	
	const [registered, setRegistered] = React.useState(false)	
	
	async function handSubmit(e){
		e.preventDefault()	
		    let userInfo		 
			if(registered){userInfo = await signIn(source).then(data => data)
				           setUserData(userInfo)
				           console.log(userInfo)
		   }else{
			  if((source.password !== source.confPass)){
	              alert('Passwords do not match.')
	         }else{
				  userInfo = await signUp(source).then( data => data )
				                   .catch(e => e.message.includes(400)
				                    && alert('User already exists.'))
		      if(userInfo){
				   await sendEmail({'user_email': userInfo.user.email.address,
					                'user_id': userInfo.user._id}) 
				         setUserData(userInfo)}
				   //~ console.log(userInfo)
	         //~ }else{ await signUp(source).then(data=>setUserData(data))
         }}}     
	     //~ console.log(userData)
	const handChange =(e)=> setSource({...source, [e.target.name]: e.target.value})
    
    React.useEffect(()=>{
		  const session = cookies.get('session')
		  if(session)router.push('/')
		},[userData])
		
  return  <S.Container>
    <S.Form onSubmit={handSubmit} id='form'>
     <S.Title>{!registered?'Sign Up':'Sign in'}</S.Title>
	 <S.Label>email: </S.Label>
	 <S.Input name='email' placeholder='Email'
	          onChange={handChange} required/><br/>
	 <S.Label text='green'>Password: </S.Label>
	 <S.Input text='black' placeholder='Password' name='password'
	          onChange={handChange} required/><br/>
	 {!registered && (<>
	 <S.Label>name: </S.Label>
	 <S.Input name='name' placeholder='Name'
	          onChange={handChange} required/><br/>
	 
	 <S.Label>Password :</S.Label>
	 <S.Input placeholder='Confirm' name='confPass'
	          onChange={handChange} required/>
	                   <br/></>)} 
	                   
	 {!registered&& <><S.Label>Role: </S.Label> 
	 <select name='role' onChange={handChange}
	         style={{fontSize:26, margin: '10px'}}>
	   <option></option>
	   <option style={{fontSize:20}}>Technician</option>
	   <option style={{fontSize:20}}>Owner</option>
	   <option style={{fontSize:20}}>Tenant</option>
	 </select> <br/></>}
	 <S.Submit type='submit'>Submit</S.Submit><br/>          
	 
	</S.Form>
	 <S.Toggler className='styledLink'
	            onClick={()=>setRegistered(!registered)}>
	                        {!registered?'Sign In'
								        :'Sign Up'}</S.Toggler>
								        
	  <S.StyledLink className='styledLink' href={'/'}>Menu</S.StyledLink>
  </S.Container>
	}

'use client'
import React from 'react'
import * as S from './auth-form.styled'
import {Label} from './auth-form.styled'

import Link from 'next/link'
import { useRouter } from '../../navigation'
import {useTranslations} from 'next-intl'

//~ import {useUserContext} from '../../context/user/UserState'
import {signIn, signUp} from '/lib'
import {sendEmail} from '../../api'
import cookies from 'js-cookie';

const initialState = {name: '', email: '', password: '', confPass: '', role: ''}

export function AuthForm(){
	const t = useTranslations("AuthForm")
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
     <S.Title>{!registered?t("sign_up"):t("sign_in")}</S.Title>
	 <S.Label>{t('e_mail')}:</S.Label>
	 <S.Input name='email' placeholder={t('p_mail')}
	          onChange={handChange} required/><br/>
	 <S.Label text='green'>{t('password')}:</S.Label>
	 <S.Input text='black' placeholder={t('p_create')} name='password'
	          onChange={handChange} required/><br/>
	 {!registered && (<>
	 <S.Label>{t('name')}:</S.Label>
	 <S.Input name='name' placeholder={t('p_name')}
	          onChange={handChange} required/><br/>
	 
	 <S.Label>{t('password')}:</S.Label>
	 <S.Input placeholder={t('p_confirm')} name='confPass'
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
	 <S.Submit type='submit'>{t('submit')}</S.Submit><br/>          
	 
	</S.Form>
	 <S.Toggler className='styledLink'
	            onClick={()=>setRegistered(!registered)}>
	                        {!registered?t("sign_in")
								        :t("sign_up")}</S.Toggler>
								        
	  <S.StyledLink className='styledLink' href={'/'}>{t('menu')}</S.StyledLink>
  </S.Container>
	}

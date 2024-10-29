'use client'
import React from 'react'
import * as S from './auth-form.styled'
import {Label} from './auth-form.styled'

import Link from 'next/link'
import { useRouter } from '../../navigation'
import {useTranslations} from 'next-intl'

import {useUserContext} from '../../context/user/UserState'

const initialState = {name: '', email: '', password: '', confPass: ''}

export function AuthForm(){
	const t = useTranslations("AuthForm")
	const router = useRouter()
	
	const {userData, setFromStorage, signIn, signUp, logout,
		                         error, clearError} =  useUserContext()
		                         
	const [source, setSource] = React.useState(initialState)
	
	const [registered, setRegistered] = React.useState(false)	
	
	function handSubmit(e){
		e.preventDefault()			 
			if(registered){signIn(source)
		   }else{
			  if((source.password !== source.confPass)){
	              alert('Passwords do not match.')
	         }else{signUp(source)
         }}}     
	     
	const handChange =(e)=> setSource({...source, [e.target.name]: e.target.value})
    
    React.useEffect(()=>{
		  if(userData.user)router.push('/')
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
	 <S.Submit type='submit'>{t('submit')}</S.Submit><br/>          
	 
	</S.Form>
	 <S.Toggler className='styledLink'
	            onClick={()=>setRegistered(!registered)}>
	                        {!registered?t("sign_in")
								        :t("sign_up")}</S.Toggler>
								        
	  <S.StyledLink className='styledLink' href={'/'}>{t('menu')}</S.StyledLink>
  </S.Container>
	}

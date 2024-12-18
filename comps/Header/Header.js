'use client'
import React from 'react'
import {AuthPanel} from './AuthPanel/AuthPanel'
import * as S from './header.styled'
import {AboutButt} from './AboutButt/AboutButt'
import Image from 'next/image'

export function Header({userData}){
  
  React.useEffect(()=>{
	    },[])
	return <S.HeadCont>
	         
	          <S.MainCont>
	           <S.LogoImg src="/HesenProperties.png"
                     width={50}
                     height={50}
                     alt="Picture of the author" />    
	          <S.MainTitle>Honest Property</S.MainTitle></S.MainCont> 
	                  
	            <AboutButt/>
	            <AuthPanel userData={userData}/>
	        </S.HeadCont>
	          
	       
	}

'use client'
import React from 'react'
import {AuthPanel} from './AuthPanel/AuthPanel'
import {CartBadge} from './CartBadge/CartBadge'
import * as S from './header.styled'
import {useTranslations} from 'next-intl'
import {LangSwitch} from './LangSwitch/LangSwitch'
import {AboutButt} from './AboutButt/AboutButt'

export function Header({userData}){
  const t = useTranslations('Header')
  
  React.useEffect(()=>{
	    },[])
	return <S.HeadCont>
	          <S.MainCont><S.MainTitle>Hesen Properties</S.MainTitle></S.MainCont>              
	            <AboutButt/>
	            <LangSwitch/>
	            <AuthPanel userData={userData}/>
	        </S.HeadCont>
	          
	       
	}

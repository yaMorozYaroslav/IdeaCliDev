'use client'
import React from 'react'
import {AuthPanel} from './AuthPanel/AuthPanel'
import {CartBadge} from './CartBadge/CartBadge'
import * as S from './header.styled'
import {useTranslations} from 'next-intl'
import {LangSwitch} from './LangSwitch/LangSwitch'

export function Header(){
  const t = useTranslations('Header')
  
  React.useEffect(()=>{
	    },[])
	return <S.HeadCont>
	          <S.MainCont><S.MainTitle>Hesen Properties</S.MainTitle></S.MainCont>              
	           <h4>About Us</h4>
	            <LangSwitch/>
	            <AuthPanel/>
	        </S.HeadCont>
	          
	       
	}

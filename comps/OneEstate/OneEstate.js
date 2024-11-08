'use client'
import React from 'react'
import * as S from './one-estate.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { usePathname } from '../../navigation'

export const OneEstate =({estate})=>{
	//~ console.log(params)
	const pathname = usePathname()
	const pathBack = '/' + pathname.split('/')[1].slice(0,4) + '-list'
	//~ console.log(pathBack)
	
	
  return (<S.Container>		              
             <Image style ={{marginTop:"150px"}}
                    alt='' src={estate.photo&&estate.photo.length?estate.photo:'/next.svg'}
                    width={100} height={100} priority={true}/><br/>
             <S.Paragraph>{estate.provName}</S.Paragraph>
             <S.Paragraph>{estate.location}</S.Paragraph>
             <S.Paragraph>{estate.owner}</S.Paragraph>    
	         <S.Paragraph>price = {estate.price}</S.Paragraph>
  <S.StyledLink href={'/'}>Back To List</S.StyledLink>
	</S.Container>)
	}


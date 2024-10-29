'use client'
import React from 'react'
import * as S from './single.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { usePathname } from '../../navigation'

export const Single =({unit, text, params})=>{
	//~ console.log(params)
	const pathname = usePathname()
	const pathBack = '/' + pathname.split('/')[1].slice(0,4) + '-list'
	//~ console.log(pathBack)
	
	
  return (<S.Container>		              
             <Image style ={{marginTop:"150px"}}
                    alt='' src={unit.photo&&unit.photo.length?unit.photo:'/next.svg'}
                    width={100} height={100} priority={true}/><br/>
             <S.Paragraph>{unit.title}</S.Paragraph>
             <S.Paragraph>{unit._id}</S.Paragraph>
             <S.Paragraph>category: {unit.category||'none'}</S.Paragraph>  
             <S.Paragraph>type: {unit.type||'none'}</S.Paragraph>  
	         <S.Paragraph>price = {unit.price}</S.Paragraph>
  <S.StyledLink href={pathBack}>Back To List</S.StyledLink>
	</S.Container>)
	}


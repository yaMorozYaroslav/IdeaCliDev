'use client'
import React from 'react'
import * as S from './one-unit.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {base} from '../../api'

export const OneUnit = ({cliUnit})=>{
	//~ console.log(params)
	const params = useParams()
	const [unit, setUnit] = React.useState(cliUnit||{})
	//~ console.log(pathBack)
   //~ await new Promise(resolve => setTimeout(resolve, 10000))
   let servUnit = []
   async function getServUnit(){
	   const result = await fetch(`${base}/units/single/${params.id}`)
	                  //~ await fetch(`http://localhost:5000/estates/${params.id}`)
                                              .then((res) => res.json())
                                              console.log(result)
       setUnit(result)}
   if(!unit._id)getServUnit()
       console.log(unit)
       
      //~ { next: { tags: ['estate'] }}
      //~ revalidateTag('estate')
   //~ return estate

     
  return (<S.Container>		              
             <Image style ={{marginTop:"150px"}}
                    alt='' src={unit.photo&&unit.photo.length?unit.photo:'/next.svg'}
                    width={100} height={100} priority={true}/><br/>
             <S.Paragraph>{unit.provName}</S.Paragraph>
             <S.Paragraph>{unit.tenant}</S.Paragraph>
             <S.Paragraph>{unit.rooms}</S.Paragraph>    
	         <S.Paragraph>price = {unit.price}</S.Paragraph>
  <S.StyledLink href={'/'}>Back To List</S.StyledLink>
	</S.Container>)
	}


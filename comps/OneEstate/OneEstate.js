'use client'
import React from 'react'
import * as S from './one-estate.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { useParams } from 'next/navigation'

export const OneEstate = ({cliEstate})=>{
	//~ console.log(params)
	const params = useParams()
	const [estate, setEstate] = React.useState(cliEstate||{})
	//~ console.log(pathBack)
   //~ await new Promise(resolve => setTimeout(resolve, 10000))
   let servEstate = []
   async function getServEstate(){
	   const result = await fetch(`http://localhost:5000/estates/${params.id}`)
                                              .then((res) => res.json())
       setEstate(result)}
   if(!estate._id)getServEstate()
       console.log(estate)
       
      //~ { next: { tags: ['estate'] }}
      //~ revalidateTag('estate')
   //~ return estate

     
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


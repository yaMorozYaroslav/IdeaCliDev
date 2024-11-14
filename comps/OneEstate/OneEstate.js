'use client'
import React from 'react'
import * as S from './one-estate.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {base} from '../../api'

export const OneEstate = ({cliEstate})=>{
	//~ console.log(params)
	const params = useParams()
	const [estate, setEstate] = React.useState(cliEstate||{})
	//~ console.log(pathBack)
   //~ await new Promise(resolve => setTimeout(resolve, 10000))
   let servEstate = []
   async function getServEstate(){
	   const result = await fetch(`${base}/estates/${params.id}`)
	                  //~ await fetch(`http://localhost:5000/estates/${params.id}`)
                                              .then((res) => res.json())
       setEstate(result)}
   if(!estate._id)getServEstate()
       console.log(estate)
       
      //~ { next: { tags: ['estate'] }}
      //~ revalidateTag('estate')
   //~ return estate
  const GenericImg = ({text, imgUrl}) => {
	  return(<><S.ImgName>{text}</S.ImgName>
	            <S.RoomImage alt={text} width={200} style={{margin:'10px'}}
	                   height={200} src={`/estate/${imgUrl}`}/>             
	         </>)
	  }
     
  return (<S.Container>	
           <S.EstateCont>	              
             <S.EstateImg style ={{marginTop:"130px"}}
                    alt='' src={estate.photo&&estate.photo.length?estate.photo:'/next.svg'}
                    width={250} height={250} priority={true}/><br/>
            
             <S.Paragraph><S.Label>province:</S.Label>
                                  {estate.provName}</S.Paragraph>
              <S.Paragraph><S.Label>location:</S.Label>
                                  {estate.location}</S.Paragraph>
              <S.Paragraph><S.Label>street:</S.Label>
                                  {estate.street||'unknown'}</S.Paragraph>
              <S.Paragraph><S.Label>owner:</S.Label>
                                  {estate.owner}</S.Paragraph>    
	          <S.Paragraph><S.Label>technician:</S.Label>
                                  {estate.technician||'nobody'}</S.Paragraph>
          
   <S.StyledLink className='styledLink'
                href={'/'}>Back To List</S.StyledLink><br/>
   <S.StyledLink className='styledLink' 
                href={`/unit-list/${estate._id}`}>Show Units</S.StyledLink>
        
        </S.EstateCont>
          <S.Pictures> <div><GenericImg text='kitchen' imgUrl='kitchen.jpg'/>
                            <GenericImg text='bathroom' imgUrl='bath.jpg'/></div>
                       
                       <div><GenericImg text='living room' imgUrl='living.jpg'/>
                            <GenericImg text='parking' imgUrl='parkin.jpg'/></div>
          </S.Pictures>
	</S.Container>)
	}


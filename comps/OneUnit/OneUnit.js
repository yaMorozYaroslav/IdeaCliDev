'use client'
import React from 'react'
import * as S from './one-unit.styled'
//import {AddForm} from '../AddForm/AddForm'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {base} from '../../api'
import {sendEmail, getEstate} from '/api'

const initialState = {user_email:'', user_phone:'', user_details: ''}

export const OneUnit = ({servData})=>{
	
	const params = useParams()
	
	const [unit, setUnit] = React.useState(servData.unit)
	const [open, setOpen] = React.useState(false)	                 
    const [source, setSource] = React.useState(initialState)

  
   //~ console.log(unit)
       
      const handChange = (e) => setSource({...source, 
		                               [e.target.name]: e.target.value})
      const onSendEmail = () => sendEmail({...source, 
		                                      owner_email: servData.estate.owner})
      
  return (<S.Container>		              
             <Image style ={{marginTop:"150px"}}
                    alt='' src={unit.photo&&unit.photo.length?unit.photo:'/next.svg'}
                    width={100} height={100} priority={true}/><br/>
             <S.Paragraph>{unit.provName}</S.Paragraph>
             <S.Paragraph>rooms: {unit.rooms}</S.Paragraph>    
	         <S.Paragraph>price: {unit.price}</S.Paragraph>
             <S.Paragraph>tenant: {unit.tenant}</S.Paragraph>
             <button onClick={()=>setOpen(true)}> 
                    Send a rental inquiry </button><br/>
               <S.Form onSubmit={onSendEmail} $open={open}>
                   <h3>Rental Inquiry</h3>
                   <label>Email: </label>
                   <input name='user_email'
                          onChange={handChange}
                          placeholder='Email'/><br/>
                   <label>Phone: </label>
                   <input name='user_phone'
                          onChange={handChange} 
                          placeholder='Phone'/><br/>
                   <S.Button type='submit'>Submit</S.Button>
                   <S.Button type='button'
                             onClick={()=>setOpen(false)}>Close</S.Button>
                   
               </S.Form>
  <S.StyledLink href={'/'}>Back To List</S.StyledLink>
	</S.Container>)
	}


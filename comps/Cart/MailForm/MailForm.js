import React from 'react'
import emailjs from '@emailjs/browser'
import * as S from './mail-form.styled'
import {regionsGet, locationsGet, officesGet} from './requests'
import axios from 'axios'
import {sendEmail} from '../../../api.js'
import {useRouter, usePathname} from 'next/navigation'

import {useLocale} from 'next-intl'
   
export const MailForm =({servData, setOpen, cartItems, 
	                     clearCart, push, setTotal})=> {
	const initialState = {user_name:'', user_email:'',
		                 user_phone:'', delivery_method:'',
		                 user_area:'', user_region:{},
		                 user_location:'', post_office: '',
		                 user_date:'', items:''}
		                 
    const [source, setSource] = React.useState(initialState)
		                                        
	const [selected, setSelected] = React.useState({regions: undefined,
		                                            locations: undefined,
		                                            offices: undefined })	 	                                       
	//~ const form = React.useRef()
	//~ console.log(selected.regions)
	const locale = usePathname().slice(0,3)
	const locale0 = useLocale()
	console.log(locale)
	
	const handChange = (e) => setSource({...source, 
		                               [e.target.name]: e.target.value})
	const pickUp = source.delivery_method === 'pick up'
	const postOffice = source.delivery_method === 'post office'

	
	function genericLocation(e, data, func, prop){e.preventDefault();handChange(e);
	         const currRef = data.filter(x => 
	                 x.Description === e.target.value).map(({Ref})=>Ref)
	                 console.log(data)
	         func(currRef[0]).then(r=>{
				 console.log(r);
				 setSelected({...selected, [prop]: r.dataAll})
				  })
	                 }
	                 
	const combArea =(e)=> genericLocation(e, servData, 
	                                              regionsGet, 'regions')
	                       
	const combRegion =(e)=> genericLocation(e, selected.regions, 
	                                          locationsGet, 'locations')
	const combLocat =(e)=> genericLocation(e, selected.locations,
	                                                  officesGet, 'offices')

		const onSendEmail = e => {
			 e.preventDefault()
			 //~ console.log()
			 sendEmail(source).then((result) => console.log(result, source),
			                    (error) => console.log(error))
			     //~ e.target.reset()
		         localStorage.removeItem('cart')
		         setOpen(false)
		         if (confirm('Would you like to pay online?')) {
					                  push(`${locale}/payment`) 
                 } else {
                   alert('Thanks for your order, we will contact you soon!')
			       clearCart()
                   push('/')
                   }
               }
		               
			
	
	React.useEffect(()=>{
	  //~ if(cartItems && source.items.length !== cartItems.length)
	         const remains = cartItems.map(({photo, creator, ...rest})=>  rest)
	         const muscles = remains.map(item => ({...item, $:'###'}))
		     setSource({...source, items: JSON.stringify(muscles)})
		},[])
  const HiddenOption = ({condition, text}) => 
                                        <S.Option hidden={condition.length}
                                                  value='1' 
                                                                    >{text}</S.Option>
		//~ ref={form}
	return  <><S.Mailer onSubmit={onSendEmail}>
	  
	           <S.Input onChange={handChange} placeholder='Name' 
	                        name='user_name'  required/><br/>
	           <S.Input onChange={handChange} placeholder='Email' 
	                        name='user_email' required/><br/>
	           <S.Input onChange={handChange} placeholder='Phone Number' 
	                        name='user_phone' required /><br/>

	           
	           <S.Select  onChange={handChange} defaultValue={source.delivery_method}
	                      name='delivery_method' required>
	               <S.Option value={''} hidden={source.delivery_method.length} 
	                      >Choose Delivery Method</S.Option>

	               <S.Option value='pick up'>Pick Up</S.Option>
	               <S.Option value='post office'>Post Office</S.Option>
	           </S.Select>
	           

	     {pickUp&&<S.Input name='user_date' 
			               onChange={handChange} 
				           placeholder='when will you come?' required/>}
	 {postOffice &&	<>		                 
	 <S.Select onChange={combArea} value={source.user_area}
	           name='user_area' required>
	                <HiddenOption condition={source.user_area} 
	                              text='Choose Area' />
	                                          
	                       {servData.map((area, i)=>
								<S.Option key={i} 
								          value={area.Description}
										          >{area.Description}
										                  </S.Option>)}
	 </S.Select>
			   
	     {selected.regions && 
			         <S.Select onChange={combRegion} name='user_region' required>
			              <HiddenOption condition={source.user_region} 
	                                    text='Choose Region' />
			               
			                    {selected.regions.map((region, i)=>
								  <S.Option key={i} value={region.Description}
								   >{region.Description}</S.Option>)}
			         </S.Select>}
			         
		 {selected.locations &&
			         <S.Select onChange={combLocat} name='user_location'>
			              <HiddenOption condition={source.user_location} 
	                                    text='Choose Location' />
			             
			                {selected.locations.map((locat, i)=>
								  <S.Option disabled={locat.Warehouse === "0"}
								            key={i} value={locat.Description}
								   >{locat.Description}</S.Option>)}
                     </S.Select>}
                     
         {selected.offices &&
			      
			         <S.Select onChange={handChange} name='post_office'>
			            <HiddenOption condition={source.post_office} 
	                                  text='Choose Office' />
			                {selected.offices.map((office, i)=>
								  <S.Option key={i} value={office.Description}
								  >{office.Description}</S.Option>)}
			         </S.Select> }
				 </>}                         		   
		
	           
	     <br />
	         <S.Textarea readOnly value={source.items} name='items' required/>
	         
	         <S.Button type='submit'>Place The Order</S.Button>
	       
	        
	         <S.Button type="button" onClick={()=>setOpen(false)}>
	                                                          Close</S.Button>
	                 </S.Mailer></>                   
		                    }

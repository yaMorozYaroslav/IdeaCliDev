'use client'
import React from 'react'
import { usePathname } from '../../../navigation'
import {useEstateContext} from '../../../context/estates/EstateState'
import {useQueryContext} from '../../../context/queries/QueryState'
import * as S from './add-estate.styled'
import revalidator from '../revalidator'

import {useTranslations} from 'next-intl'
import TextField from "@mui/material/TextField";

import {requests} from './requests'


export function AddEstate({servData, setOpen, currItem, setCurrItem}){
	
	const t = useTranslations("AddForm")
	const tc = useTranslations("categories")
	const tt = useTranslations("types")
	
	const {source, setSource, labels, locations,
	       searchLocations, onImage} = requests()
		                                                                                      
	const pathname = usePathname()
	
	const {addEstate, updateEstate, fetchEstates} = useEstateContext()
	const {state} = useQueryContext()
	
	const ref = React.useRef()
   
   const fetcher =()=> {}
   
    
    React.useEffect(()=>{		
	       	   if(currItem._id)setSource(currItem)       
	       },[currItem])
    //~ console.log(source)
    const reset =()=> {	
		setCurrItem({})
		setSource({})
		ref.current.reset()
		}		
		       
		
	const handChange =(e)=> setSource({...source, [e.target.name]: e.target.value})
	
	const changeBorder =(e)=> {
			e.target.style.border = '2px solid purple'
			setTimeout(() => e.target.style.border = null, 1000)
			}
	
	const handClose =(e)=> {e.preventDefault();setOpen(false);}
	
	const handSubmit =(e)=> {
		e.preventDefault()
		    if(!source._id){addEstate(source).then(()=>fetchEstates(state))		           
	                     
	        }else{updateEstate(source._id, source)
							                   .then(()=>fetchEstates(state))}
							
	        	console.log(source._id)					                   	 
                reset()
	            setOpen(false)
	        	     setTimeout(() => {
	        				alert('Element has been '+
	                              (!source._id?'added.':'updated.'))},1000)
	            revalidator()
		        }
  
  
	function PhotoSelector({label, name}){
		return <S.Selector>
          <label>{label}:&#160;</label>
	      <S.PhotoBut htmlFor={name}>Select:</S.PhotoBut>
	      <S.Selected>{eval(`labels.${name}`)}</S.Selected>
	      <input type='file' id={name} style={{display:"none"}}
	             onChange={(e)=>onImage(e)}/><br/>
               </S.Selector> 
		} 
	 return(
	<S.ExtraCont>
	 <S.Container>
	 
	 <S.Title>AddEstate</S.Title>
	<S.Form onSubmit={handSubmit} ref={ref}>
	
	 
	 {/* <label>Province:</label><br/>
	                              
	 <select onChange={(e) => onLocations(e)} mode="multiple" 
	         defaultValue={source.provName}>
	         
	        {!source.provName && <option >Select Province...</option>}
	          {selected.provinces.map((province, i)=>
				 <option key={i} value={JSON.stringify(province)} 
						          >{province.name}
    					                  </option>)} </select><br/>
         
    
    {selected.locations.length > 0 &&
		        <><input list="location_names" placeholder="Location Name"
                       onChange={(e)=>onSearch(e)}/> <br/>
         <datalist id="location_names">
              {selected.locations.length &&
				  selected.locations.map(location => 
	                               <option value={location.label}/>)}       
         </datalist></>} */}
    <label for="locations_input">Location: </label>
    <input id="locations_input" list="locations_names"
           autocomplete={false} placeholder="location"
          onChange={(e)=>searchLocations(e)}/> <br/>
   <datalist id="locations_names">
   {locations.length && locations.map(location => 
	                               <option key={location.id}
	                                       value={location.label}/>)}       
  </datalist>
   
   <PhotoSelector label='Main' name='main'/>	
   <PhotoSelector label='Bathroom' name='bath'/>	
   <PhotoSelector label='Living Room' name='live'/>	
   <PhotoSelector label='Kitchen' name='kitch'/>	
   <PhotoSelector label='Parking' name='park'/>	
                            
	     <S.Submit onMouseOver={changeBorder} type='submit'>{t('save')}</S.Submit>
	     <S.Close onMouseOver={changeBorder} 
	              onClick={handClose}>{t('close')}</S.Close>
	
	   </S.Form>
	 </S.Container>
	</S.ExtraCont>
	 )
	}

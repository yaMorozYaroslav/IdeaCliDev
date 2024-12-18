'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
import {useUnitContext} from '/context/units/UnitState'
import {useQueryContext} from '/context/queries/QueryState'
import * as S from './add-unit.styled'
import revalidator from '../revalidator'

import {uploadImage} from './convert-base64'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useParams } from 'next/navigation'

const initialState = { price: '', rooms: '', photo: ''}

export function AddUnit({servData, setOpen, currItem, setCurrItem}){
	const params = useParams()
	
	
	const [source, setSource] = React.useState(initialState)
	const [label, setLabel] = React.useState(t('no file'||source.photo))
	
	const [selected, setSelected] = React.useState({provinces: [],
		                                            locations: []})
		                                            
    const {state} = useQueryContext()
		                                          
	const pathname = usePathname()
	
	const {addUnit, updateUnit, fetchEstateUnits} = useUnitContext()
	//~ const {state} = useQueryContext()
	
	const ref = React.useRef()
    
   const onImage =   async(e) => {
		const {base64, file, sizeInKb} = await uploadImage(e)
		console.log(sizeInKb)
		setSource({...source, photo: base64})
		setLabel(file.name)
		}
   
   const fetcher =()=> {}
   
    
    React.useEffect(()=>{		
	       	   if(currItem._id)setSource(currItem)       
	       },[currItem])
    //~ console.log(source)
    const reset =()=> {	
		setCurrItem({})
		setSource(initialState)
		ref.current.reset()
		}		
		       
		
	const handChange =(e)=> setSource({...source, [e.target.name]: e.target.value})
	
	const changeBorder =(e)=> {
			e.target.style.border = '2px solid purple'
			setTimeout(() => e.target.style.border = null, 1000)
			}
	
	const handClose =(e)=> {e.preventDefault();setOpen(false);}
	
    const afterSubmit = () => {alert('Element has been '+ 
		                            (!source._id?'added.':'updated.'));
						       fetchEstateUnits({'estateID': params.id,
									                'page': state.page})}
	const handSubmit =(e)=> {
		e.preventDefault()
		    if(!source._id){addUnit(params.id, source)
				               .then(()=>afterSubmit())		           
	                     
	        }else{updateUnit(source._id, source)
							  .then(()=>afterSubmit())}					                   	 
        reset()
	    setOpen(false)
	    revalidator()
		        }
    console.log(source)
	 return(
	<S.ExtraCont>
	 <S.Container>
	 
	 <S.Title>AddUnit</S.Title>
	<S.Form onSubmit={handSubmit} ref={ref}>
	
	 
	 <label>Price:</label><br/>
	 <input name='price' value={source.price} onChange={handChange}/><br/>
	 <label>Rooms:</label><br/>
	 <input name='rooms' value={source.rooms} onChange={handChange}/><br/>
	                              
	
   <S.Selector>
      <label>Photo:&#160;</label>
	  <S.PhotoBut htmlFor="input">{t('select')}</S.PhotoBut>
	  <S.Selected>{label}</S.Selected>
	  <input type='file' id="input" style={{display:"none"}}
	         onChange={(e)=>onImage(e)}/><br/>
   </S.Selector> 
     
	 
	
	
                            
	     <S.Submit onMouseOver={changeBorder} type='submit'>{t('save')}</S.Submit>
	     <S.Close onMouseOver={changeBorder} 
	              onClick={handClose}>{t('close')}</S.Close>
	
	   </S.Form>
	 </S.Container>
	</S.ExtraCont>
	 )
	}

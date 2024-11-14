'use client'
import React from 'react'
import { usePathname } from '../../../navigation'
import {useEstateContext} from '../../../context/estates/EstateState'
import {useQueryContext} from '../../../context/queries/QueryState'
import * as S from './add-estate.styled'
import revalidator from '../revalidator'

import {useTranslations} from 'next-intl'
import {uploadImage} from './convert-base64'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {getProvinces, getLocations, searchLocations} from './requests'

const initialState = { provName: '', provCode:'', location:'', 
	                   street:'', main: '', bath:'', live: '',
	                   kitch: '', park: '' }

export function AddEstate({servData, setOpen, currItem, setCurrItem}){
	
	const t = useTranslations("AddForm")
	const tc = useTranslations("categories")
	const tt = useTranslations("types")
	
	const [source, setSource] = React.useState(initialState)
	const [labels, setLabels] = React.useState({main: 'no file', bath:'no file',
		                                        live: 'no file',
		                                        kitch: 'no file', park: 'no file'})
	
	const [selected, setSelected] = React.useState({provinces: [],
		                                            locations: []})
		                                                                                      
	const pathname = usePathname()
	const isSeed = true
	
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
		setSource(initialState)
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
    console.log(source)
    
                                          
    async function onProvinces(){
		const {provinceData} = await getProvinces()
		setSelected({...selected, provinces: provinceData})
		}             
   React.useEffect(()=>{onProvinces()},[])
   
    async function onLocations(e){
		const {locationData, targetValues} = await getLocations(e)
		
		   setSelected({...selected, locations: locationData})
           setSource({...source, provName: targetValues.name,
			                     provCode: targetValues.code})
		}
    async function onSearch(e){
		const {locationData, targetValue} = await searchLocations(e, source.provCode)
		//~ console.log(locationData)
		setSelected({...selected, locations: locationData})
	   setSource({...source, location: targetValue}) 
		}
    const onImage = async(e) => {
    const {base64, file, sizeInKb} = await uploadImage(e)
    console.log(sizeInKb)
    setSource({...source, [e.target.id]: base64})
    setLabels({...labels, [e.target.id]: file.name})
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
	
	 
	 <label>Province:</label><br/>
	                              
	 <select onChange={(e) => onLocations(e)} mode="multiple" 
	         defaultValue={source.provName}>
	         
	              {!source.provName && <option >Select Province...</option>}
	              {selected.provinces.map((province, i)=>
								<option key={i} value={JSON.stringify(province)} 
										          >{province.name}
										                  </option>)} </select>
    {source.provName&&<Autocomplete
            style = {{ width: 200, marginLeft: 167, marginTop: 10 }}
            autoComplete
            autoHighlight
            freeSolo
            options = {selected.locations?selected.locations:[{label:"Loading.."}]}
            getOptionKey={option=>option.id}
            onChange={(e,value)=>{value?setSource({...source, location: value.label}):null}}                     
            renderInput = {(data) => (
               <TextField {...data}  label = "Location"
                          onChange={((e)=>onSearch(e))}/>
            )} />}
   
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

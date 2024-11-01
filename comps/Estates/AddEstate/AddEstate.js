'use client'
import React from 'react'
import { usePathname } from '../../../navigation';
import {useEstateContext} from '../../../context/estates/EstateState'
import {useItemContext} from '../../../context/items/ItemState'
import {useQueryContext} from '../../../context/queries/QueryState'
import * as S from './add-estate.styled'
import revalidator from '../revalidator'
import {allCats, seedTypes, itemTypes} from '../select-types'

import {useTranslations} from 'next-intl'
import {uploadImage} from './convert-base64'
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const initialState = { provName: '', provCode:'', location:'', street:'',
	                   available: 0, photo: ''}

export function AddEstate({servData, setOpen, currItem, setCurrItem}){
	const t = useTranslations("AddForm")
	const tc = useTranslations("categories")
	const tt = useTranslations("types")
	const [source, setSource] = React.useState(initialState)
	const [label, setLabel] = React.useState(t('no file'))
	
	const [selected, setSelected] = React.useState({provinces: [],
		                                            locations: []})
		                                            
  const base = 'https://geogratis.gc.ca/services/geoname/en/geonames.json'
  
  async function getProvinces() {
      let allData = await fetch(`${base}?concise=PROV`, )
                                                   .then((res) => res.json())
      let provinceData = allData.items.map(({name, province}) => 
                                          ({name: name, code: province.code}))
                                          
      setSelected({...selected, provinces: provinceData})}
          
          console.log(selected.locations)
          
   React.useEffect(()=>{getProvinces()},[])

   
  async function getLocations(e){
	  e.preventDefault()
	  let targetValues = JSON.parse(event.target.value)
	  let allData = await fetch(`${base}?province=${targetValues.code}`, )
                                                   .then((res) => res.json())
                                         
      let locationData = allData.items.map(item => ({label:item.name, id:item.id}))
      setSelected({...selected, locations: locationData})
      setSource({...source, provName: targetValues.name, provCode: targetValues.code})
      console.log(targetValues)
	  }
  
	  async function searchLocations(e){
	  e.preventDefault()
	  
	   let allData = await fetch(
	        `${base}?province=${source.provCode}&q=${event.target.value}`, )
                                                   .then((res) => res.json())
        console.log(allData)
	   let locationData = allData.items.map(item => ({label:item.name, 
		                                              id:item.id})) 
	   setSelected({...selected, locations: locationData})
	   setSource({...source, location: e.target.value})                                      
	   }
 console.log(source)
	
		                                          
	const pathname = usePathname()
	const isSeed = true
	
	const {addEstate, updateEstate, fetchEstates} = useEstateContext()
	const {addItem, updateItem, fetchItems} = useItemContext()
	const {state} = useQueryContext()
	
	const ref = React.useRef()
    
   const onImage =   async(e) => {
		const {base64, file, sizeInKb} = await uploadImage(e)
		console.log(sizeInKb)
		setSource({...source, photo: base64})
		setLabel(file.name)
		}
   
   const fetcher =()=> {fetchEstates(state)}
   
    
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
	if(isSeed){if(!source._id){addEstate(source).then(()=>fetcher())		           
	          }else{updateEstate(source._id, source).then(()=>fetcher())}
			 
   }else{     if(!source._id){addItem(source).then(()=>fetcher())		           
	          }else{updateItem(source._id, source).then(()=>fetcher())}  }
        reset()
	    setOpen(false)
		     setTimeout(() => {
					alert('Element has been '+
	                      (!source._id?'added.':'updated.'))},1000)
	    revalidator()
		        }
    console.log(source)
	 return(
	<S.ExtraCont>
	 <S.Container>
	 
	 <S.Title>AddEstate</S.Title>
	<S.Form onSubmit={handSubmit} ref={ref}>
	
	 
	 <label>Province:</label><br/>
	                              
	 <select onChange={(e) => getLocations(e)} mode="multiple" 
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
                          onChange={((e)=>searchLocations(e))}/>
            )} />}
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

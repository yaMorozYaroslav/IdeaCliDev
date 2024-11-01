'use client'
import React from 'react'
import { usePathname } from '../../../navigation';
import {useEstateContext} from '../../../context/estates/EstateState'
import {useItemContext} from '../../../context/items/ItemState'
import {useQueryContext} from '../../../context/queries/QueryState'
import * as S from './add-form.styled'
import revalidator from '../revalidator'
import {allCats, seedTypes, itemTypes} from '../select-types'

import {useTranslations} from 'next-intl'
import {uploadImage} from './convert-base64'

const initialState = {title: '', description: '', price: '', 
	                  category: '', type: '', photo: ''}

export function AddForm({setOpen, currItem, setCurrItem}){
	const t = useTranslations("AddForm")
	const tc = useTranslations("categories")
	const tt = useTranslations("types")
	const [source, setSource] = React.useState(initialState)
	const [label, setLabel] = React.useState(t('no file'))
	
	
		 //~ console.log(source)
	
	const pathname = usePathname()
	const isSeed = pathname === '/seed-list'
	
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
   
   const fetcher =()=> isSeed?fetchSeeds(state):fetchItems(state)
   
	const shownCats = isSeed?allCats.seedCats:allCats.itemCats
    
    React.useEffect(()=>{		
	       	   if(currItem._id)setSource(currItem)       
	       },[currItem])
    //~ console.log(source)
    const reset =()=> {	
		setCurrItem({})
		setSource(initialState)
		ref.current.reset()
		}		
		       
     let currType
	{shownCats.map((category,i) => {
		       if(source.category===category&&category.length){
						  currType = Object.values(
		                  !isSeed?itemTypes:seedTypes)[i-1]}})}
		
	const handChange =(e)=> setSource({...source, [e.target.name]: e.target.value})
	
	const changeBorder =(e)=> {
			e.target.style.border = '2px solid purple'
			setTimeout(() => e.target.style.border = null, 1000)
			}
	
	const handClose =(e)=> {e.preventDefault();setOpen(false);}
	
	const handSubmit =(e)=> {
		e.preventDefault()
	if(isSeed){if(!source._id){addSeed(source).then(()=>fetcher())		           
	          }else{updateSeed(source._id, source).then(()=>fetcher())}
			 
   }else{     if(!source._id){addItem(source).then(()=>fetcher())		           
	          }else{updateItem(source._id, source).then(()=>fetcher())}  }
        reset()
	    setOpen(false)
		     setTimeout(() => {
					alert('Element has been '+
	                      (!source._id?'added.':'updated.'))},1000)
	    revalidator()
		        }
	
	 return(
	<S.ExtraCont>
	 <S.Container>
	 
	 <S.Title>{!isSeed?t('item'):t('seed')}</S.Title>
	<S.Form onSubmit={handSubmit} ref={ref}>
	
	 <label>{t('title')}:</label>
	 <S.Input name='title' 
	          value={source.title}    
	          onChange={handChange}
	                     required/><br/>
	 
	 <label>{t('description')}:</label><br/>
	 <S.Textarea name='description'
	              value={source.description} 
	              onChange={handChange}
	                              required/><br/>
	 
	 <label>{t('price')}:</label>
	 <S.Input name='price'
	        value={source.price}
	        onChange={e=>setSource(
				          {...source,
						   price: Number(e.target.value)||0})}
	                                               required/>₴<br/>
   <S.Selector>
      <label>{t('photo')}:&#160;</label>
	  <S.PhotoBut htmlFor="input">{t('select')}</S.PhotoBut>
	  <S.Selected>{label}</S.Selected>
	  <input type='file' id="input" style={{display:"none"}}
	         onChange={(e)=>onImage(e)}/><br/>
   </S.Selector> 
       
	 <S.CatLabel>{t('category')}:</S.CatLabel>
	 <S.CatSelect name='category'
	             value={source.category}
	             onChange={handChange} >
	             
	{shownCats.map((item, i) => 
		<S.Option key={i} value={item}>{!item?null:tc(`${item}`)}</S.Option>)}
	 </S.CatSelect><br/>
	 
	 <S.TypeLabel>{t('type')}:</S.TypeLabel>
	 <S.TypeSelect name='type'
	         value={source.type}
	         onChange={handChange}
	          >
	     {currType && currType.map((item,i) => 
			   <S.Option key={i} value={item}>{!item?null:tt(`${item}`)}</S.Option>)}
	 </S.TypeSelect><br/>
	
                            
	     <S.Submit onMouseOver={changeBorder} type='submit'>{t('save')}</S.Submit>
	     <S.Close onMouseOver={changeBorder} 
	              onClick={handClose}>{t('close')}</S.Close>
	
	   </S.Form>
	 </S.Container>
	</S.ExtraCont>
	 )
	}

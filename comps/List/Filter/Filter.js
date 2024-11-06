import React from 'react'
import { usePathname } from '../../../navigation';
import {useQueryContext} from '../../../context/queries/QueryState'
import {useUnitContext} from '../../../context/units/UnitState'
import {useEstateContext} from '../../../context/estates/EstateState'
import * as S from './filter.styled'
import {allCats, seedTypes, itemTypes} from '../select-types'
import Fade from '@mui/material/Fade';
//~ import { useLocale } from 'next-intl'
import {useTranslations} from 'next-intl'
import axios from 'axios'

export const Filter =(props)=> {
    
    
	const t = useTranslations('Filter')
	const tc = useTranslations('categories')
	const tt = useTranslations('types')
	//~ const locale = useLocale()   
	const pathname = usePathname()
	const isSeed = pathname === '/seed-list'
	
	
	
	const [show, setShow] = React.useState(false)
	
	const {state, setCategory, setType,
		   setSearch,setReverse, reset} = useQueryContext()

	const {items, fetchItems} = useItemContext()
	const {seeds, fetchSeeds} = useSeedContext()
	
	//const size = ScreenSize()
	//~ console.log(isSeed)
	const shownCats = isSeed?allCats.seedCats:allCats.itemCats
	
	  let currType
	{shownCats.map((item,i) => {
		            if(state.category === item&&item.length){
		//~ currType = Object.values(isSeed?seedTypes:itemTypes)[isSeed?i-1:i-1]
		currType = Object.values(isSeed?seedTypes:itemTypes)[i-1]
		                                                     }})}
		                           
    function fetchUnits(source){if(isSeed){fetchSeeds(source)
		                       }else{fetchItems(source)     }}
	const onSort =()=> {
		               setReverse(!state.reverse)
		               fetchUnits({...state, reverse: !state.reverse})
		               }
	
	const resetFilt =()=> {
		reset()
		
		fetchUnits({category:'',type:'',page:1, search:'', reverse:false})
		}
	function onCategory(event){
		event.preventDefault()
		if(state.search)setSearch('')
		setCategory(event.target.value)	
		fetchUnits({...state, category: event.target.value, type: '', page: 1})
		}
	function onType(event){
		event.preventDefault()
		setType(event.target.value)
		fetchUnits({...state, type: event.target.value, page:1})
		}
	 
	function onSearch(event){
		event.preventDefault()
		setSearch(event.target.value)
		if(state.category)setCategory('')
		fetchUnits({...state, page:1, search: event.target.value})
		}
		
    const changeBorder =(e)=> {
			e.target.style.border = '2px solid green'
			setTimeout(() => e.target.style.border = null, 1000)
			}
	
	return <S.Container>
	        
	   <Fade style={{ transitionDuration: '1000ms' }} in={show}>
	   
	      <S.Panel>
		         
		  <S.Label>{t("category")}: </S.Label>
		 <S.Select name='category'
		           value={state.category}
	               onChange={onCategory}>
	  {shownCats.map((item, i) => <option key={i} 
		                                value={item}>
		                                   {!item?null:tc(`${item}`)}
		                          </option>)}
	 </S.Select><br/>
	     
	       <S.Label>{t("type")}: </S.Label>
	     <S.Select name='type'
	               onChange={onType}>
	     {currType && currType.map((item,i) => 
			   <option key={i}
				    value={item}>{!item?null:tt(`${item}`)}</option>)}
	 </S.Select><br/>
	     <S.Label>{t("sort")}</S.Label>
	     <S.FiltBut onClick={onSort}>
	               {state.reverse?'Minimum':'Maximum'}</S.FiltBut><br/>
	     
	     <S.Input value={state.search} 
	              onChange={onSearch} 
	              placeholder={t("search")}/><br/>
	     <S.FiltBut onClick={resetFilt} 
	                onMouseOver={changeBorder}>{t("reset")}</S.FiltBut>
	     </S.Panel></Fade>
	     
	    <S.ShowBut $show={show}
	               onMouseOver={changeBorder}  
		           onClick={()=>setShow(!show)}>
		                 {!show?t("show"):'X'}</S.ShowBut>
	     </S.Container>
	}

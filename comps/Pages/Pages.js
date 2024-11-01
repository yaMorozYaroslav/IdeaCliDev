'use client'
import React from 'react'
import { usePathname } from '../../navigation';
import {useEstateContext} from '../../context/estates/EstateState'
import {useItemContext} from '../../context/items/ItemState'
import {useQueryContext} from '../../context/queries/QueryState'
import * as S from './pages.styled.js'
import {Button} from './pages.styled.js'
import {useTranslations} from 'next-intl'


export function Pages(total) {
	const t = useTranslations("Pages")
	const pathname = usePathname()
    const isEstate = true
	
	//~ console.log(isSeed)
	
	//console.log(total)
	const {state, setPage} = useQueryContext()
	const {estates, fetchEstates} = useEstateContext()
	const {items} = useItemContext()
	console.log(estates)
	const notExist = estates.message||items.message?true:false
	//~ const notExist = estates.message||items.message?true:false
    
	const activer = (s) => isEstate && estates.currPage === s||
	                       !isEstate && items.currPage === s
	                       
	const idler   = (s) => !estates.currPage&&!items.currPage&&s===1
	
	const dynamicTotal = !estates.totalPages && !items.totalPages && !notExist
	                                  ?total.total
	                                  :(estates.totalPages||items.totalPages)
	  //~ console.log(items.message, seeds.message)
    //console.log(state)                       
    function fetchUnits(e){
		       fetchEstates({ page: e.target.value})
	           setPage(e.target.value)
		} 
    //~ function fetchUnits(e){
		//~ e.preventDefault()
		//~ if(isSeed){fetchSeeds({...state, page: e.target.value})
	    //~ }else{fetchItems({...state, page: e.target.value})}
	    //~ setPage(e.target.value)
		//~ } 
  return (<>
          <S.Container >
             Pages:
               {[...Array(dynamicTotal)].map((e, i) => 
                  <Button $stata={activer(i+1)||idler(i+1)}
                           key={i} value={i+1} onClick={fetchUnits}>
				                                        {i+1}</Button>)}
		  </S.Container>       
          </> )
}

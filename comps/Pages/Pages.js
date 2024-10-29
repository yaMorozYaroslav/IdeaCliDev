'use client'
import React from 'react'
import { usePathname } from '../../navigation';
import {useSeedContext} from '../../context/seeds/SeedState'
import {useItemContext} from '../../context/items/ItemState'
import {useQueryContext} from '../../context/queries/QueryState'
import * as S from './pages.styled.js'
import {Button} from './pages.styled.js'
import {useTranslations} from 'next-intl'


export function Pages(total) {
	const t = useTranslations("Pages")
	const pathname = usePathname()
	const isSeed = pathname === '/seed-list'
	
	//~ console.log(isSeed)
	
	//console.log(total)
	const {state, setPage} = useQueryContext()
	const {seeds, fetchSeeds} = useSeedContext()
	const {items, fetchItems} = useItemContext()
	
	const notExist = seeds.message||items.message?true:false
    
	const activer = (s) => isSeed && seeds.currPage === s||!isSeed && items.currPage === s
	const idler   = (s) => !seeds.currPage&&!items.currPage&&s===1
	const dynamicTotal = !seeds.totalPages && !items.totalPages && !notExist
	                                  ?total.total
	                                  :(seeds.totalPages||items.totalPages)
	  //~ console.log(items.message, seeds.message)
    //console.log(state)                       
    function fetchUnits(e){
		e.preventDefault()
		if(isSeed){fetchSeeds({...state, page: e.target.value})
	    }else{fetchItems({...state, page: e.target.value})}
	    setPage(e.target.value)
		} 
  return (<>
          <S.Container >
             {t("pages")}:
               {[...Array(dynamicTotal)].map((e, i) => 
                  <Button $stata={activer(i+1)||idler(i+1)}
                           key={i} value={i+1} onClick={fetchUnits}>
				                                        {i+1}</Button>)}
		  </S.Container>       
          </> )
}

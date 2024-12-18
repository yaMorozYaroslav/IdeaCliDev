'use client'
import React from 'react'
import { usePathname } from 'next/navigation';
import {useEstateContext} from '../../context/estates/EstateState'
import {useUnitContext} from '../../context/units/UnitState'
import {useQueryContext} from '../../context/queries/QueryState'
import * as S from './pages.styled.js'
import {Button} from './pages.styled.js'
//~ import {useTranslations} from 'next-intl'
import { useParams } from 'next/navigation'


export function Pages(total) {
	//~ const t = useTranslations("Pages")
	const pathname = usePathname()
    const isEstate = pathname === '/'
    const params = useParams()
    //~ console.log(isEstate)
	
	//~ console.log(isSeed)
	
	//console.log(total)
	const {state, setPage} = useQueryContext()
	const {estates, fetchEstates} = useEstateContext()
	const {units, fetchEstateUnits} = useUnitContext()
	//~ console.log(units)
	//~ console.log(estates)
	const notExist = estates.message||units.message?true:false
	//~ const notExist = estates.message||items.message?true:false
    
	const activer = (s) => isEstate && estates.currPage === s||
	                       !isEstate && units.currPage === s
	                       
	const idler   = (s) => !estates.currPage&&!units.currPage&&s===1
	
	const dynamicTotal = !estates.totalPages && !units.totalPages && !notExist
	                                  ?total.total
	                                  :(estates.totalPages||units.totalPages)
	
    function fetchThings(e){
		e.preventDefault()
		if(isEstate){fetchEstates({'page': e.target.value})
	    }else{fetchEstateUnits({'estateID': params.id, 'page': e.target.value})}
	    setPage(e.target.value)
		} 
  return (<>
          <S.Container >
             Pages:
               {[...Array(dynamicTotal)].map((e, i) => 
                  <Button $stata={activer(i+1)||idler(i+1)}
                           key={i} value={i+1} onClick={fetchThings}>
				                                        {i+1}</Button>)}
		  </S.Container>       
          </> )
}

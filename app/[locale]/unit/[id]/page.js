'use client'
import {OneUnit} from '../../../../comps/OneUnit/OneUnit'
import {useUnitContext} from '../../../../context/units/UnitState'
//~ import { revalidateTag } from 'next/cache'

//~ export const dynamicParams = true

//~ export async function generateStaticParams(){
  //~ const items = await fetch(
    //~ 'https://seed-shop-back-78049b8c30bb.herokuapp.com/items?category=')
                                        //~ .then((res) => res.json())
                                        
    //~ return items.data.map((item) => ({id: item._id}))
	//~ }

 
export default function Unit({params}){
        const {units} = useUnitContext()
        //~ console.log(estates.length)
        const thisUnit = units.length?
                               units.filter(unit => unit._id === params.id)
                               : {} 
       
	//~ console.log(estates)
	
	return <OneUnit cliUnit={thisUnit[0]} />
	}

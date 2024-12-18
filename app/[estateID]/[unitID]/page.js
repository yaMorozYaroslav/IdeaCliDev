//~ 'use client'
import {OneUnit} from '/comps/OneUnit/OneUnit'
import {useUnitContext} from '/context/units/UnitState'
import {base} from '/api'
//~ import { revalidateTag } from 'next/cache'

//~ export const dynamicParams = true

//~ export async function generateStaticParams(){
  //~ const items = await fetch(
    //~ 'https://seed-shop-back-78049b8c30bb.herokuapp.com/items?category=')
                                        //~ .then((res) => res.json())
                                        
    //~ return items.data.map((item) => ({id: item._id}))
	//~ }
   async function getServData(p){
	              const unit = await fetch(`${base}/units/single/${p.unitID}`).then((res) => res.json())
	              const estate = await fetch(`${base}/estates/${p.estateID}`).then((res) => res.json())
	              //~ const owner = estate.owner
	              return {unit, estate} }         
 
export default async function Unit({params}){
	    const thisData = await getServData(params)
	    console.log(thisData.estate.owner)
        //~ const {units} = useUnitContext()
        //~ let units = {}
        //~ console.log(estates.length)
        //~ const thisUnit = units.length?
                               //~ units.filter(unit => unit._id === params.unitID)
                               //~ : {} 
       
	//~ console.log(estates)
	
	return <OneUnit servData={thisData} />
	}

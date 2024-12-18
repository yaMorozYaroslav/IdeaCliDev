'use client'
import {OneEstate} from '/comps/OneEstate/OneEstate'
import {useEstateContext} from '/context/estates/EstateState'
//~ import { revalidateTag } from 'next/cache'

//~ export const dynamicParams = true

//~ export async function generateStaticParams(){
  //~ const items = await fetch(
    //~ 'https://seed-shop-back-78049b8c30bb.herokuapp.com/items?category=')
                                        //~ .then((res) => res.json())
                                        
    //~ return items.data.map((item) => ({id: item._id}))
	//~ }

 
export default function Estate({params}){
        const {estates} = useEstateContext()
        //~ console.log(estates.length)
        const thisEstate = estates.length?
                               estates.filter(estate => estate._id === params.id)
                               : {} 
       
	//~ console.log(estates)
	
	return <OneEstate cliEstate={thisEstate[0]} />
	}

'use client'
import {OneEstate} from '../../../../comps/OneEstate/OneEstate'
import {useEstateContext} from '../../../../context/estates/EstateState'
//~ import { revalidateTag } from 'next/cache'

//~ export const dynamicParams = true

//~ export async function generateStaticParams(){
  //~ const items = await fetch(
    //~ 'https://seed-shop-back-78049b8c30bb.herokuapp.com/items?category=')
                                        //~ .then((res) => res.json())
                                        
    //~ return items.data.map((item) => ({id: item._id}))
	//~ }

 //~ async function getItem(params) {
   //~ await new Promise(resolve => setTimeout(resolve, 10000))
   //~ const item = await fetch(
    //~ `https://seed-shop-back-78049b8c30bb.herokuapp.com/items/${params.id}`)
                                            //~ .then((res) => res.json())
      
         //~ { next: { tags: ['item'] }}
      //~ revalidateTag('item')
   //~ return item

       //~ }
export default function Estate({params}){
        const {estates} = useEstateContext()
        const thisEstate = estates.filter(estate => estate._id === params.id) 
	//~ const item = await getItem(params)
	console.log(thisEstate)
	
	return <OneEstate estate={thisEstate[0]} />
	}

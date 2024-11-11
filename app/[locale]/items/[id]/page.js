//~ import {Single} from '../../../../comps/Single/Single'
//~ import { revalidateTag } from 'next/cache'

export const dynamicParams = true

//~ export async function generateStaticParams(){
  //~ const items = await fetch(
    //~ 'https://seed-shop-back-78049b8c30bb.herokuapp.com/items?category=')
                                        //~ .then((res) => res.json())
                                        
    //~ return items.data.map((item) => ({id: item._id}))
	//~ }

 async function getItem(params) {
   await new Promise(resolve => setTimeout(resolve, 10000))
   const item = await fetch(
    `https://seed-shop-back-78049b8c30bb.herokuapp.com/items/${params.id}`)
                                            .then((res) => res.json())
   
   return item

       }
export default async function Item({params}){

	const item = await getItem(params)
	
	return <p>page</p>
	}

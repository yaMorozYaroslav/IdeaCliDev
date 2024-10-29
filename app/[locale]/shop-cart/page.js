import {Cart} from '../../../comps/Cart/Cart'

async function anyName() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY
  const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
    method: 'POST',
    headers: {},
    body: JSON.stringify({
  "apiKey": `${apiKey}`,
   "modelName": "Address",
   "calledMethod": "getSettlementAreas",
   "methodProperties": {
     "Ref" : ""
   }
    })      
   //~ //JSON.stringify({ time: new Date().toISOString() }),
  }, { next: { tags: ['regions'], revalidate: 1000}}) 
  const data = await res.json()
  const regions = data.data.map(({
	                   Description, Ref, ...rest})=> ({Description,
	                                                           Ref}))
           return {regions}
         }

export default async function ShopCart(){
	const {regions} = await anyName()
    //~ revalidateTag('items')
	return (<Cart servData={regions} />)
	}

import {Estates} from '../comps/Estates/Estates'
import { Acme } from 'next/font/google'
import {Russo_One} from 'next/font/google'
import {Pages} from '../comps/Pages/Pages'
import {getSession} from '../lib'

import {cookies} from 'next/headers'
//~ import {Metadata} from 'next'

async function anyName() {
  const allData = 
     await fetch('https://hesen-properties-3eefa0d80ae7.herokuapp.com/estates?page=&location=', { next: { tags: ['estates'] }})
                                            .then((res) => res.json())

      //~ revalidateTag('estates')  
   
  return  {allData}
}
//~ export const metadata = { title: 'Title', description: 'gardening store'}
const lora = Russo_One({ subsets: ['cyrillic'], weight:['400'] })

export default async function Main() {
	
	const rawData = await cookies().get('session')
	const stringified = JSON.parse(rawData||'{"data": 40}')
	console.log(stringified)
	const userData = stringified.user?stringified.user:stringified
	
	const {allData} = await anyName()
	
  return (<><Estates  userData={userData} servData={allData} />
               <Pages total={allData.totalPages}/>
          </>)
}

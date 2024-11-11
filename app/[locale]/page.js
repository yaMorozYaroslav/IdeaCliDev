import {Estates} from '../../comps/Estates/Estates'
import { Acme } from 'next/font/google'
import {Russo_One} from 'next/font/google'
import {Pages} from '../../comps/Pages/Pages'
//~ import {Metadata} from 'next'

async function anyName() {
  const allData = 
     await fetch('http://localhost:5000/estates?page=&location=', 
 
                            { next: { tags: ['estates'] }})
                                            .then((res) => res.json())

      //~ revalidateTag('estates')  
   
  return  allData
}
//~ export const metadata = { title: 'Title', description: 'gardening store'}
const lora = Russo_One({ subsets: ['cyrillic'], weight:['400'] })

export default async function Main() {
	
	const allData = await anyName()
	
	//~ className={lora.className}
  return      <div><Estates servData={allData} />
              <Pages total={allData.totalPages}/>
              </div>
}

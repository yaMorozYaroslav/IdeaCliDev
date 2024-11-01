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
      
   const someData = allData.data
   const totalPages = allData.totalPages
  return  {someData, totalPages}
}
//~ export const metadata = { title: 'Title', description: 'gardening store'}
const lora = Russo_One({ subsets: ['cyrillic'], weight:['400'] })

export default async function Main() {
	
	const {someData, totalPages} = await anyName()
	
	//~ className={lora.className}
  return <div><Estates servData={someData} />
              <Pages total={totalPages}/>
              </div>
}

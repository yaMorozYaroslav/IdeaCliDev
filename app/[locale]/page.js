import {First} from '../../comps/First/First'
import { Acme } from 'next/font/google'
import {Russo_One} from 'next/font/google'
//~ import {Metadata} from 'next'

//~ export const metadata = { title: 'Title', description: 'gardening store'}
const lora = Russo_One({ subsets: ['cyrillic'], weight:['400'] })

export default async function Main() {
	
	//~ className={lora.className}
  return <div><First/></div>
}

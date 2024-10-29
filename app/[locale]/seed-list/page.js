import {Pages} from '../../../comps/Pages/Pages'
import {List} from '../../../comps/List/List'
import { revalidateTag } from 'next/cache'


async function anyName() {
  const allData = 
     await fetch('https://seed-shop-back-78049b8c30bb.herokuapp.com/seeds?category=&type=', 
                            { next: { tags: ['seeds'] }})
                                            .then((res) => res.json())
      //~ revalidateTag('seeds')
      
   const someData = allData.data
   const totalPages = allData.totalPages
  return  {someData, totalPages}
}

  

export default async function SeedList() {
	const {someData, totalPages} = await anyName()
	
  return (<>
     
      <List servData={someData}/>
      <Pages total={totalPages}/>
        </>
  )
}

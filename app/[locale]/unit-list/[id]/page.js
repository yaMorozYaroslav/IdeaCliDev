import {Pages} from '../../../../comps/Pages/Pages'
import {Units} from '../../../../comps/Units/Units'
import { revalidateTag } from 'next/cache'
import {base} from '../../../../api'
import {getSession} from '../../../../lib'

async function anyName(estateID) {
  const allData = 
     await fetch(`${base}/units/${estateID}`, 
     //~ await fetch(`http://localhost:5000/estates/${estateID}`, 
                            { next: { tags: ['units'] }})
                                            .then((res) => res.json())
      //~ revalidateTag('units')
      console.log(allData.data)
   const someData = allData.data
   const totalPages = allData.totalPages
  return  {someData, totalPages}
}

  

export default async function UnitList({params}) {
	
	const {someData, totalPages} = await anyName(params.id)
	
	const rawData = await getSession()
	const stringified = JSON.parse(rawData||'{}')
	const userData = stringified.user?stringified.user:stringified
	
	console.log(totalPages)
	//~ console.log(params)
  return (<>
     
      <Units userData={userData} servData={someData}/>
      <Pages total={totalPages}/>
        </>
  )
}

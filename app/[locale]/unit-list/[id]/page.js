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
  const estate = await fetch(`${base}/estates/${estateID}`).then((res) => res.json())
      //~ revalidateTag('units')
   const someData = allData.data
   const totalPages = allData.totalPages
  return  {someData, totalPages, estate}
}

  

export default async function UnitList({params}) {
	
	const {someData, totalPages, estate} = await anyName(params.id)
	
	const rawData = await getSession()
	const stringified = JSON.parse(rawData||'{}')
	const userData = stringified.user?stringified.user:stringified
	
	
  return (<>
     
      <Units userData={userData} servData={someData} estate={estate}/>
      <Pages total={totalPages}/>
        </>
  )
}

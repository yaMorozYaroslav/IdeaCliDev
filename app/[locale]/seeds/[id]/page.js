import {Single} from '../../../../comps/Single/Single'
//~ import { revalidateTag } from 'next/cache

export const dynamicParams = true

export async function generateStaticParams({params: {locale}}){
  const seeds = await fetch(
    'https://seed-shop-back-78049b8c30bb.herokuapp.com/seeds?category=&type=')
                                        .then((res) => res.json())
  const arrSeeds = seeds.data.map((seed) => ({id: seed._id, locale: locale}))
    return  arrSeeds
	}
	
 async function getSeed(source) {
   const seed = await fetch(
    `https://seed-shop-back-78049b8c30bb.herokuapp.com/seeds/${source}`, 
                            { next: { tags: ['seed'] }})
                                            .then((res) => res.json())
      //~ revalidateTag('seed')
   return seed

       }
 
export default async function Seed({params}){

	const seed = await getSeed(params.id)
	
	return <Single unit={seed}/>
	}

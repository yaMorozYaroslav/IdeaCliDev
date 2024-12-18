//~ import {Suspense} from 'react'
import {UserState} from '../context/user/UserState'
import {EstateState} from '../context/estates/EstateState'
import {QueryState} from '../context/queries/QueryState'
import {UnitState} from '../context/units/UnitState'
import {CartState} from '../context/cart/CartState'
import {LoadState} from '../context/LoadState'
import { Suspense } from 'react'

import {Header} from '../comps/Header/Header'

import { Lora } from 'next/font/google'
import {Russo_One} from 'next/font/google'

import {notFound} from 'next/navigation'
import {unstable_setRequestLocale} from 'next-intl/server'
import StyledComponentsRegistry from './registry'
import {Metadata} from 'next'
import {getSession} from '../lib'
import {cookies} from 'next/headers'

import { Metadata } from 'next';

const lora = Russo_One({ subsets: ['cyrillic'], weight: ['400'] })
//~ import {useLocale} from 'next-intl'

//~ const locales = ['en', 'ua', 'ru']


//~ const lora = Lora({ subsets: ['latin'] })
//~ const lora = Yeseva_One({subsets: ['cyrillic'], weight: '400' })
//~ export const metadata : Metadata = {
  //~ title: 'Flora Izyum',
  //~ description: 'Do not 12 13 14 15',
  //~ icons: {
    //~ icon: "/logo.png",
  //~ },
    //~ metadataBase: new URL('https://flora-izyum.vercel.app/en/seed-list'),

//~ }

export const metadata: Metadata = {
  title: 'Honest Property',
  description: 'The official Honest Property website, built with NextJS.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};
export default async function RootLayout({ children }) {
	const rawData = await cookies().get('session')
	//~ console.log(rawData)
	const parsed = JSON.parse(rawData||'{}')
    
	const userData = parsed.user?parsed.user:parsed
  return (
  <html>
    <head>
			<link rel='icon' href='/HesenProperties.png' />
		</head>
    <body className={lora.className}>
     <StyledComponentsRegistry>
            <EstateState>
            <UnitState>
            <CartState>
            <QueryState>
            <LoadState>
            <Header userData={userData}/>
             <Suspense fallback={<p>Loading</p>}>
               {children}
             </Suspense>
            </LoadState>
            </QueryState>
            </CartState>
            </UnitState>
            </EstateState>
     </StyledComponentsRegistry>
    </body>
   </html>
  )
}

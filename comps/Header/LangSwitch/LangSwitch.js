import React from 'react'
import * as S from './lang-switch.styled'
import {useLocale} from 'next-intl'
import { useRouter, usePathname } from '../../../navigation'

export const LangSwitch =()=> {
  const p = usePathname()
  const router = useRouter()
  const locale = useLocale()
  
  const [open, setOpen] = React.useState(false)
  
  let langStrings = ["en","ua","ru"]
  
  const [strings, setStrings] = React.useState(langStrings)
  
  const handSwitch =(thing)=> {router.push(p, {locale: thing });
	                        const filteredStrings = langStrings.filter(
	                                                           elem=>elem !== thing)
	                            setStrings([thing,...filteredStrings])
	                           	   //~ console.log(strings)  
	                           	    }              
  const shouldHide =(str)=> !open&&str!==locale                       	                           
              //~ {!open && locale}                   
  return  <S.Ul onClick={()=>setOpen(!open)} onMouseLeave={()=>setOpen(false)}>
               
                     
                     {strings.map((string, i)=>
				           <S.Li key={i} onClick={()=>handSwitch(string)}
				                 value={string} hidden={shouldHide(string)}
			                                                  >{string}</S.Li>)}
          </S.Ul>
	     
	}


  

'use client'
import React from 'react'
import * as S from './list.styled'
import {Filter} from './Filter/Filter'
import Box from '@mui/material/Box';
import {AddForm} from './AddForm/AddForm'
import {SpinZone} from '../../blocks/SpinZone'
//~ import LinearProgress from '@mui/material/LinearProgress';

import {useItemContext} from '../../context/items/ItemState'
import {useSeedContext} from '../../context/seeds/SeedState'
import {useQueryContext} from '../../context/queries/QueryState'
import {useUserContext} from '../../context/user/UserState'
import {useCartContext} from '../../context/cart/CartState'

import revalidator from './revalidator'

import { usePathname } from '../../navigation'
import { useRouter } from '../../navigation'
import {useTranslations} from 'next-intl'

import {Cell} from './Cell/Cell'

export function List({servData}){
	const t = useTranslations('List')
	const tc = useTranslations('categories')
	const tt = useTranslations('types')
	//~ console.log(servData)
	const pathname = usePathname()
	const router = useRouter()
	const isSeed = pathname === '/seed-list'
	
	const [open, setOpen] = React.useState({form: false})
    const [shown, setShown] = React.useState(servData)
	const [currItem, setCurrItem] = React.useState({})
	const [staticData, setStaticData] = React.useState(servData)
	
	const {userData} = useUserContext()
	const {cartItems, addToCart} = useCartContext()
	const {fetchItems, loadingItems, items,
		               removeItem, resetItems} = useItemContext()
	const {fetchSeeds, loadingSeeds, seeds, 
		               removeSeed, resetSeeds} = useSeedContext()
	const {state, category} = useQueryContext()
	
	
	const units = !items.length?seeds:items
	const loading = loadingItems||loadingSeeds
	
	const creator =(id)=> userData.user && (userData.user._id === id)
	const admin = userData.user && userData.user.role === 'admin'
	
	
	const handAdd =(e, s)=> {e.preventDefault();addToCart(s);}
	
	const handEdit =(e, s)=> {e.preventDefault(); 
		                      setCurrItem(s);setOpen({...open, form: true})}
		                      
    const onMenu = () => {router.push('/');if(isSeed){
							            resetSeeds()}else{resetItems()}}
	const showOptions =()=>{setOpen({...open, options: !open.options});}
	
	function fetchUnits(){if(isSeed){fetchSeeds(state)}
		                       else{fetchItems(state)} } 
                       
	function delUnit(e, id){
		e.preventDefault();
		if(isSeed){removeSeed(id)}else{removeItem(id)}
		revalidator()
		setTimeout(()=>{fetchUnits()},500)
		}	

   React.useEffect(()=>{ if(seeds.data && isSeed){setShown(seeds.data)}
	                    if(items.data && !isSeed){setShown(items.data)}
	                  },[items, seeds])
  //conn
return (<S.Container>
      <S.ListButts>
        <Filter/>
        {admin &&       
			<S.AddAdmin onClick={()=>setOpen({...open, form: true})}>
			                   {t('add_butt')}</S.AddAdmin>}
       
     <SpinZone><S.NotLink onClick={()=>onMenu()}>
                                  {t('menu')}</S.NotLink></SpinZone>      
      </S.ListButts> 
         
       {open.form &&
		     <AddForm setOpen={setOpen} 
		              currItem={currItem}
		              setCurrItem={setCurrItem}
		               />}  
		               
	   {loading &&  <S.SpinCont><S.Spinner/></S.SpinCont>}
       {shown && shown.length>0 && !loading && <S.List>
          
          
         {shown.map(item => 
		   <Cell key={item._id} item={item} open={open}
			     showOptions={showOptions} creator={creator} 
			     isSeed={isSeed} admin={admin} t={t} tc={tc} tt={tt} 
			     handEdit={handEdit} handAdd={handAdd} delUnit={delUnit}/>)}       
        </S.List>}
        
         {!shown.length&&<S.NoData>No products found for this request</S.NoData>}
         
       </S.Container>)
} 

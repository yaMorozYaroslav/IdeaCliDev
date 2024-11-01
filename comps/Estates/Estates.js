'use client'
import React from 'react'
import * as S from './estates.styled'
import Box from '@mui/material/Box';
import {AddEstate} from './AddEstate/AddEstate'
import {SpinZone} from '../../blocks/SpinZone'
//~ import LinearProgress from '@mui/material/LinearProgress';

import {useItemContext} from '../../context/items/ItemState'
import {useEstateContext} from '../../context/estates/EstateState'
import {useQueryContext} from '../../context/queries/QueryState'
import {useUserContext} from '../../context/user/UserState'
import {useCartContext} from '../../context/cart/CartState'

import revalidator from './revalidator'

import { usePathname } from '../../navigation'
import { useRouter } from '../../navigation'
import {useTranslations} from 'next-intl'

import {ECell} from './ECell/ECell'

export function Estates(servData){
	console.log(servData.servData)
	const t = useTranslations('List')
	//~ console.log(servData)
	const pathname = usePathname()
	const router = useRouter()
	const [open, setOpen] = React.useState({form: false})
    const [shown, setShown] = React.useState(servData.servData)
	const [currItem, setCurrItem] = React.useState({})
	const [staticData, setStaticData] = React.useState(servData.servData)
	
	const {userData} = useUserContext()
	const {cartItems, addToCart} = useCartContext()
	const {fetchItems, loadingItems, items,
		               removeItem, resetItems} = useItemContext()
	const {fetchEstates, loadingEstates, estates, 
		               removeEstate, resetEstates} = useEstateContext()
	const {state, category} = useQueryContext()
	
	
	const units = !items.length?estates:items
	const loading = loadingItems||loadingEstates
	
	const creator =(id)=> userData.user && (userData.user._id === id)
	const admin = userData.user && userData.user.role === 'admin'
	
	
	const handAdd =(e, s)=> {e.preventDefault();addToCart(s);}
	
	const handEdit =(e, s)=> {e.preventDefault(); 
		                      setCurrItem(s);setOpen({...open, form: true})}
		                      
    const onMenu = () => {router.push('/');if(isSeed){
							            resetEstates()}else{resetItems()}}
	const showOptions =()=>{setOpen({...open, options: !open.options});}
	
	function fetchUnits(){if(isSeed){fetchEstates(state)}
		                       else{fetchItems(state)} } 
                       
	function delUnit(e, id){
		e.preventDefault();
		removeEstate(id)
		revalidator()
		setTimeout(()=>{fetchUnits()},500)
		}	

   React.useEffect(()=>{ if(estates.data){setShown(estates.data)}
	                  },[ estates])
       
return (<S.Container>
      <S.ListButts>
       {open.form &&
		     <AddEstate setOpen={setOpen} 
		                currItem={currItem}
		                setCurrItem={setCurrItem}
		               />} 
        {true &&       
			<S.AddAdmin onClick={()=>setOpen({...open, form: true})}>
			                   {t('add_butt')}</S.AddAdmin>}
       
     <SpinZone><S.NotLink onClick={()=>onMenu()}>
                                  {t('menu')}</S.NotLink></SpinZone>      
      </S.ListButts> 
         
     
		               
	   {loading &&  <S.SpinCont><S.Spinner/></S.SpinCont>}
       {shown && shown.length>0 && !loading && <S.List>
          
          
         {shown.map(item => 
		   <ECell key={item._id} item={item} open={open}
			     showOptions={showOptions} creator={creator} 
			     admin={admin} 
			     handEdit={handEdit} handAdd={handAdd} delUnit={delUnit}/>)}       
        </S.List>}
        
         {!shown.length&&<S.NoData>No products found for this request</S.NoData>}
         
       </S.Container>)
} 

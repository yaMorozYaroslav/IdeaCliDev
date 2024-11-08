'use client'
import React from 'react'
import * as S from './estates.styled'
import Box from '@mui/material/Box';
import {AddEstate} from './AddEstate/AddEstate'
import {SpinZone} from '../../blocks/SpinZone'
//~ import LinearProgress from '@mui/material/LinearProgress';

import {useEstateContext} from '../../context/estates/EstateState'
import {useQueryContext} from '../../context/queries/QueryState'
import {useUserContext} from '../../context/user/UserState'
import {useCartContext} from '../../context/cart/CartState'

import revalidator from './revalidator'

import { usePathname } from '../../navigation'
import { useRouter } from '../../navigation'
import {useTranslations} from 'next-intl'
import AddHomeIcon from '@mui/icons-material/AddHomeWork';

import {ECell} from './ECell/ECell'

export function Estates(servData){
	
	const t = useTranslations('List')
	const pathname = usePathname()
	const router = useRouter()
	
	const [open, setOpen] = React.useState({form: false})
    const [shown, setShown] = React.useState(servData.servData)
	const [currItem, setCurrItem] = React.useState({})
	const [staticData, setStaticData] = React.useState(servData.servData)
	
	const {userData} = useUserContext()
	const {cartItems, addToCart} = useCartContext()
	
	const {fetchEstates, loadingEstates, estates, 
		   removeEstate, resetEstates, setEstates} = useEstateContext()
  	               
	const {state, category} = useQueryContext()
	
	const propertyOwner =(id)=> userData.user && (userData.user._id === id)
	const owner = userData.user && userData.user.role === 'owner'
	const admin = userData.user && userData.user.role === 'admin'
	
	
	const handAdd =(e, s)=> {e.preventDefault();addToCart(s);}
	
	const handEdit =(e, s)=> {e.preventDefault(); 
		                      setCurrItem(s);setOpen({...open, form: true})}
		                      
    const onMenu = () => {router.push('/'); resetEstates()}
	const showOptions =()=>{setOpen({...open, options: !open.options});}
	
                       
	function deleteEstate(e, id){
		e.preventDefault();
		removeEstate(id)
		revalidator()
		setTimeout(()=>{fetchEstates(state)},500)
		}	
   //~ console.log(servData.servData)
   React.useEffect(()=>{ if(!estates.data){setEstates(servData.servData)}
	                    if(estates.data){setShown(estates.data)
	                    }
	                  },[estates])
	                  console.log(estates)
       
return (<S.Container>
      <S.ListButts>
       {owner||admin &&       
			 <S.AddAdmin onClick={()=>setOpen({...open, form: true})}>
			                   <AddHomeIcon fontSize='large'/> </S.AddAdmin>}
	  <S.Title>Estates</S.Title>
       {open.form &&
		     <AddEstate setOpen={setOpen} 
		                currItem={currItem}
		                setCurrItem={setCurrItem}
		               />} 
            
      </S.ListButts> 
         
     
		               
	   {loadingEstates &&  <S.SpinCont><S.Spinner/></S.SpinCont>}
       {shown && shown.length>0 && !loadingEstates && <S.List>
          
          
         {shown.map(item => 
		   <ECell key={item._id} item={item} open={open}
			     showOptions={showOptions} owner={propertyOwner} 
			     admin={admin} 
			     handEdit={handEdit} handAdd={handAdd} 
			     deleteEstate={deleteEstate}/>)}       
        </S.List>}
        
         {!shown.length&&<S.NoData>No products found for this request</S.NoData>}
         
       </S.Container>)
} 

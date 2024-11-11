'use client'
import React from 'react'
import * as S from './e-cell.styled'

import {Link} from '../../../navigation'

//~ import AddCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/ContentPasteSearch';
import OffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import ApartmentIcon from '@mui/icons-material/Apartment';

export const ECell =({item, showOptions, owner, admin,
	                  open, handAdd, handEdit, deleteEstate})=> {

const [options, setOptions] = React.useState(false)
const urlSingle = true?'seeds':'items'
function keyy(num){ return Object.keys(item)[num] }	

const [emptyData, setEmptyData] = React.useState(0)

React.useEffect(()=>{
		const hasEmpty = async () => {
		let allData = await fetch(
		                   //~ 'http://localhost:5000/units/all/empty')
		                   'https://hesen-properties-3eefa0d80ae7.herokuapp.com/units/all/empty')
		                                 .then((res) => res.json())
		const isEmpty = allData.data.filter(unit => unit._id === item._id)
		const result = isEmpty.length?isEmpty[0].quantity:0
		setEmptyData(result)
		console.log(result)	
	}
	hasEmpty()
		},[])

return(<>
    <S.Cell  key={item._id} $emptyData={emptyData}
             onMouseLeave={()=>setOptions(false)}>
             {!options && <S.StyledImage alt='' 
				                         src={item.photo&&item.photo.length
				                                    ?item.photo:'/next.svg'}
				                         //~ onClick={(e)=>handAdd(e,item)}
				                         onClick={()=>setOptions(true)}
                                         width={0} height={0} 
                                         priority={true}/>  }
     
      {options && <S.FourButtons><S.StyledButtons>
				   
				            
	     <S.DetailsLink className='styledLink'
                        href={`/estate/${item._id}`}>
	    
	          <S.InnerButt>
	                          Estate Info    
	             <SearchIcon style={{position:'relative',
				                     top:'5px', left: '5px',
				                     fontSize:'26px'}}/>
	          </S.InnerButt>
	          
	     </S.DetailsLink>
				             
		 <S.UnitsLink className='styledLink' href={`/unit-list/${item._id}`}>
		    <S.InnerButt style={{borderBottom: '2px solid'}}>
		                      Show Units
              <ApartmentIcon style={{position:'relative',
				                   top:'5px', left: '5px',
				                   fontSize:'26px'}}/>
		    </S.InnerButt>
         </S.UnitsLink>
	                
				  </S.StyledButtons>
				  
				  {(owner(item.owner)||admin||true)
				   
				&&<S.SuperButts><S.KingButt onClick={(e)=>
					      deleteEstate(e, item._id)}>
			                <OffIcon style={{fontSize:'30px', 
								             marginTop:'2px'}}/>
	                </S.KingButt>
				    <S.KingButt onClick={(e)=>handEdit(e, item)}>
				            <EditIcon style={{fontSize:'30px',
								              marginTop:'2px'}}/>
	                </S.KingButt> </S.SuperButts>}	
			  
				  </S.FourButtons>}
            <br/>                   
           
               <S.Parag>province: {item.provName}</S.Parag>
               <S.Parag>location: {item.location?item.location:'---'}</S.Parag>
               <S.Parag>owner: {item.owner} </S.Parag>          
              
</S.Cell>
             </> )}

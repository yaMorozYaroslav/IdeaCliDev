'use client'
import React from 'react'
import * as S from './u-cell.styled'

import AddCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/ContentPasteSearch';
import OffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

export const UCell =({item, showOptions, creator, admin,
	                  open, handEdit, deleteUnit})=> {

const [options, setOptions] = React.useState(false)
const urlSingle = true?'seeds':'items'
function keyy(num){ return Object.keys(item)[num] }	


return(<>
    <S.Cell  key={item._id} 
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
                        href={`/${urlSingle}/${item._id}`}>
	    
	          <S.DetailsButt>
	                          Details
	             <SearchIcon style={{position:'relative',
				                   top:'5px',fontSize:'25px'}}/>
	          </S.DetailsButt>
	          
	     </S.DetailsLink>
				             
		
	                
				  </S.StyledButtons>
				  
				  {(creator(item.creator)||admin)
				   
				&&<S.SuperButts><S.KingButt onClick={(e)=>
					      deleteUnit(e, item._id)}>
			                <OffIcon style={{fontSize:'30px', 
								             marginTop:'2px'}}/>
	                </S.KingButt>
				    <S.KingButt onClick={(e)=>handEdit(e, item)}>
				            <EditIcon style={{fontSize:'30px',
								              marginTop:'2px'}}/>
	                </S.KingButt> </S.SuperButts>}	
			  
				  </S.FourButtons>}
            <br/>                   
           
               <S.Parag>price: {item.price}</S.Parag>
               <S.Parag>rooms: {item.rooms}</S.Parag>               
               
              
</S.Cell>
             </> )}

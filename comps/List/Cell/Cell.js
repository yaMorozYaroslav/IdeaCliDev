'use client'
import React from 'react'
import * as S from './cell.styled'

import AddCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/ContentPasteSearch';
import OffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

export const Cell =({item, showOptions, creator, admin, isSeed,
	                 t, tc, tt, open, handAdd, handEdit, delUnit})=> {

const [options, setOptions] = React.useState(false)
const urlSingle = isSeed?'seeds':'items'	


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
	                          {t('details')}
	             <SearchIcon style={{position:'relative',
				                   top:'5px',fontSize:'25px'}}/>
	          </S.DetailsButt>
	          
	     </S.DetailsLink>
				             
		 <S.AddButt onClick={(e)=>handAdd(e,item)}>{t('add_butt')}
              <AddCartIcon style={{position:'relative',
				                   top:'5px',fontSize:'25px'}}/>
         </S.AddButt>
	                
				  </S.StyledButtons>
				  
				  {(creator(item.creator)||admin)
				   
				&&<S.SuperButts><S.KingButt onClick={(e)=>
					      delUnit(e, item._id)}>
			                <OffIcon style={{fontSize:'30px', 
								             marginTop:'2px'}}/>
	                </S.KingButt>
				    <S.KingButt onClick={(e)=>handEdit(e, item)}>
				            <EditIcon style={{fontSize:'30px',
								              marginTop:'2px'}}/>
	                </S.KingButt> </S.SuperButts>}	
			  
				  </S.FourButtons>}
            <br/>                   
               <S.Title>{item.title.slice(0,12)}</S.Title>
               <S.Parag>{t('category')}: {item.category?tc(item.category):'---'}</S.Parag>
               <S.Parag>{t('type')}: {item.type?tt(item.type):'---'}</S.Parag>
               <S.Parag>{t('price')}: {item.price} ₴</S.Parag>               
               
              
</S.Cell>
             </> )}

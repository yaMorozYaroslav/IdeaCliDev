'use client'
import React from 'react'
import * as S from './e-cell.styled'

import AddCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/ContentPasteSearch';
import OffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

export const ECell =({item, showOptions, creator, admin,
	                  open, handAdd, handEdit, delUnit})=> {

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
               <S.Parag>{keyy(0)}: {item._id.slice(5,15)} </S.Parag>
               <S.Parag>location: {item.location?item.location:'---'}</S.Parag>
               <S.Parag>owner: {item.owner||'unknown'} </S.Parag>               
               
              
</S.Cell>
             </> )}

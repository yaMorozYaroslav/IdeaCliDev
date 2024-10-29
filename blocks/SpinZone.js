import styled from 'styled-components'
import {Link} from '../navigation'
import React from 'react'

const Container = styled.div`cursor: ${p => p.$value?'wait':'pointer'}`

export const SpinZone = ({children}) => {
	
	const [loading, setLoading] = React.useState(false)
	
return (<><Container onClick={()=>setLoading(true)} 
                     $value={loading}>{children}</Container> </>)
	}

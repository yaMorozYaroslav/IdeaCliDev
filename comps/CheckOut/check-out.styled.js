import styled from 'styled-components'
import {Link} from '../../navigation'

export const Container = styled.div`position:relative;top:100px;
                                  @media (max-width: 600px) {top:160px;}`

export const RealLink = styled(Link)`display: flex;
                                font-size: 24px;padding: 15px;
                                border:1px solid olive;
                                color:black; background:white;
                        @media (max-width: 400px){font-size:20px; padding: 18px;
                                                  padding-left:5px;padding-right:5px}`                      

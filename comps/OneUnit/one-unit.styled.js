'use client'

import styled from 'styled-components'
import {Link} from 'next/navigation'

export const Container = styled.div`text-align:center;margin-top:0%;`
export const Paragraph = styled.p``
export const Form = styled.form`display: ${p=>!p.$open && 'none'};
                                position: absolute;margin:-220px 0% 0% 38%;
                                color:white;background: black;`
export const Button = styled.button`margin:5px;`
                                
export const StyledLink = styled(Link)`
                             color: green;
                             margin: 10px;`



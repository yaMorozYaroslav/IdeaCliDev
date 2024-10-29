'use client'
import styled from 'styled-components'

export const Ul = styled.ul`list-style:none;cursor:pointer;font-size:30px;
                            z-index:1;padding:4px 10px 4px 10px;
                            background:lightgreen;
                            margin-top:15px;border-radius:10px;
                  @media (max-width:800px){margin-left:0%;margin-right:0%;}
                  @media (max-width:600px){margin-left:12%;margin-right:0%;
                                           width:40%;}
                  @media (max-width:400px){margin-left:25%;}`
export const Li = styled.li`
                            &:hover{color:gold;}`

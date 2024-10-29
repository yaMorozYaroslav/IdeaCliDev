'use client'

import styled from 'styled-components'
import Link from 'next/link'

export const Container = styled.div`display: grid; justify-content: center; 
                                    padding:10px 5% 10px 5%;
                                    grid-template-columns: repeat(6, 1fr);
                         @media (max-width: 1000px) {}`
export const Form = styled.form`grid-column: 3/5;
                                padding: 0px 5% 10px 5%;
                                margin-top: 110px;
                                text-align: center;
                                border: 2px solid brown;
                    @media (max-width: 1000px) {grid-column:2/6;}
                    @media (max-width: 600px) {grid-column:1/7;margin-top:150px;
                                               padding-left: 8%;padding-right: 8%;}
                    @media (max-width: 400px) {padding:0px;}`
export const Title = styled.h2`margin:10px 0px 10px 0px;
                     @media (max-width: 600px) {font-size:28px;}`
export const Label = styled('label').withConfig({shouldForwardProp: () => true})`
	                       //~ ${({text})=>text&&`color: white;`}
	                       background: none;
	                       font-size:24px;
	                 @media (max-width: 1000px) {font-size:26px;}`
export const Input = styled('input').withConfig({shouldForwardProp:() => true})`
                           //~ background: ${p=>p.text};
                               background:lightblue;
                               font-size: 24px;
                               margin: 5px;
                               width: 55%;
                     @media (max-width: 1000px) {width:50%;}
                     @media (max-width: 600px) {width:80%;}`
export const Submit = styled.button`border-style:outset;border-radius:10px;
                                    margin:10px;font-size:26px;padding:6px;`
export const Toggler = styled.section`grid-column: 3/3;margin-top:-2px; font-size:23px;
                                      border:2px solid brown;border-right:none;
                                      text-align:center;padding:10px; color:blue;
                              &:hover {cursor: grab;}
                       @media (max-width: 1000px) {grid-column:2/4;font-size:20px;}
                       @media (max-width: 600px) {grid-column:1/4}`

export const StyledLink = styled(Link)`grid-column:4/4;
                                       margin-top:-2px;
                                       font-size:23px;
                                       color: blue;
                                       text-align: center;
                                       border:2px solid brown;
                                       padding: 10px;
                          @media (max-width: 1000px) {grid-column:4/6}
                          @media (max-width: 600px) {grid-column:4/7;font-size:20px;}`

'use client'
import styled from 'styled-components'
import Image from 'next/image'
import {Link} from '../../navigation'

export const HeadCont = styled.section`display: flex;position:absolute;
                                       width:98%;text-align:center;
                                       justify-content: space-around;
                                                                           
                        @media (max-width: 600px) {display:grid;
                                               grid-template-columns: repeat(3, 33.3%);
                                                   height:132px;}
                        @media (max-width: 400px) {margin-left:-15px;}`
export const LogoImg = styled(Image)`margin:-10px 5% 0px 0px;
       @media (max-width: 400px) {width:70px;}`
                        
export const MainCont = styled.div`background-color: white;
                                   background-size: cover;
                                   display: flex;
                                   width:33%;height:30px;padding:20px;
                                   border:solid;border-radius:10px;
                                   margin:3px -4% 0px 0px;
                        @media (max-width: 1000px) {width:30%;
                                                    margin: 3px 0% 0px -1%;}
                        @media (max-width: 600px) {grid-column: 1/3;width:80%;
                                                   margin-left:2%;}
                        @media (max-width: 400px) {width:75%;margin-left:7%;
                                                   justify-content: center;}`
export const MainTitle = styled.h6`color:black;font-size:35px;
                                   text-align:left;
                                   margin:0px 0px 10px 0px;
                                   width:100%; 
                          @media (max-width: 1200px) {font-size:30px;}
                          @media (max-width: 1000px) {width:50%;
                                                      font-size:28px;
                                                      margin-top:-18px;
                                                      }
                          @media (max-width: 400px) {font-size:28px;
                                                     margin-top:-18px;
                                                     display: none;} `

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
export const MainCont = styled.div`background-image:url('/grass.jpg');
                                   background-size: cover;
                                   width:30%;height:30px;padding:20px;
                                   border:solid;border-radius:10px;
                                   margin:3px -4% 0px 0px;
                        @media (max-width: 1000px) {margin: 3px 0% 0px -1%;}
                        @media (max-width: 600px) {grid-column: 1/3;width:90%;
                                                   margin-left:2%;}
                        @media (max-width: 400px) {width:85%;margin-left:7%;}`
export const MainTitle = styled.h6`color:white;font-size:55px;margin:-15px 10px 0px 0px;
                                  width:30%;
                          @media (max-width: 800px) {font-size:50px;
                                                     margin-left:-5px;margin-top:-10px;}
                          @media (max-width: 400px) {font-size:44px;
                                                     margin-left:-10px;margin-top:-5px;} `

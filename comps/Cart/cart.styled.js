'use client'
import styled from 'styled-components'
import {Link} from '../../navigation'
import Image from 'next/image'

export const Container = styled.div`position:absolute;top:100px;width:100%;
                         @media (max-width:600px) {top:170px;}`
export const CartList = styled.section`width: 60%;margin:0px 0% 30px 20%;
                        @media (max-width: 1000px) {margin-left:15%;width:70%}
                        @media (max-width: 800px) {margin-left:5%;width:90%}
                        @media (max-width: 600px) {margin-left:3%;width:94%;}`
export const Thing = styled.section`display:grid;
                                    grid-template-columns: repeat(6, 1fr);
                                    grid-template-rows: 100px 100px 100px;
                                    border:2px solid black; font-size:23px;
                                    padding: 15px; height:180px; margin:5px;
                     @media (max-width: 600px){height:310px;}
                     @media (max-width: 400px) {
                             height: 400px;
                             grid-template-columns: repeat(7, 1fr);
                             grid-template-rows: 100px 100px 100px 100px 100px;}`
export const Number = styled.label`grid-column:1;grid-row:2;
                                   margin-left:-5px;margin-top:25px;
                                   font-size:32px;padding:10px;
                      @media (max-width: 600px){margin-top:30px;}`
export const StyledImage = styled(Image)`grid-row:1;width:120px;height:120px;
                                         margin:10px;border: 1px solid black;
                           @media (max-width:600px) {margin-left:0px;}
                           @media (max-width:400px) {grid-column:3/8;
                                                     width:150px;height:150px;}`
export const Title = styled.h1`grid-column:2/5;grid-row:1;
                               width:90%;font-size:25px;
                               margin-left:10px;margin-top:20px;
                     @media (max-width: 600px) {grid-column:3/8;}
                     @media (max-width: 400px) {grid-column:2/8;grid-row:3;
                                                margin-top:-25px;}`
export const Quantity = styled.p`grid-column:2/5;grid-row:2;
                                 margin-top:-10px;
                                 background: lightgreen;padding:15px;
                                 width:80%;padding-top:-15px;
                        @media (max-width: 600px) {grid-column:2/7;
                                                   margin-top:20px;padding-top:-5px;
                                                   height:60px;width:83%}
                        @media (max-width: 400px) {grid-column:1/8;grid-row:3;
                                                   font-size:22px;
                                                   height:55px;padding:10px;
                                                   margin-top:40px;margin-left:10px;}`
export const Butts = styled.section`grid-column:5/7;grid-row:1/3;
                                    border-style:dashed;
                                    width:100%;height:174px;
                                    text-align:right;
                                    margin-top:0px;
                     @media (max-width: 1000px) {display:block;}
                     @media (max-width: 600px) {grid-column:1/8;grid-row:3;
                                                height:58px;margin-top:50px;}
                     @media (max-width: 400px) {grid-row:4;height:70px;
                                                margin-top:25px;margin-left:1px;
                                                text-align:center;border:none;}`
export const ThingButt= styled.button`font-size:22px;width:100%;height:58px;
                        @media (max-width: 600px) {width:33.3%;font-size:23px;}
                        @media (max-width: 400px) {width:48%;height:35px;margin:2px;}`

export const CartButts = styled.section`text-align:center;
                         @media (max-width: 400px) {width:110%;margin-left:-5%;}`
export const Total = styled.p`font-size:28px;margin:-5px 25% 20px 25%;
                              background:black;color:white;
                     @media (max-width:600px) {margin:0px 15% 20px 15%;}`
export const Button = styled.button`font-size:25px;margin:5px;margin-bottom:20px;
                                    padding:5px;`
export const StyledLink = styled(Link)`font-size: 24px;padding: 10px;
                                       margin-bottom:10px; border:1px solid olive; 
                                       color:black;`



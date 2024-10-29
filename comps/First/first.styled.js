import styled from 'styled-components'
import {Link} from '../../navigation'
//~ import Image from 'next/image'

export const Container = styled.div`text-align: center; display: grid;
                                    grid-template-columns: repeat(7, 1fr);
                                    grid-template-rows: 0fr 1fr 1.5fr;
                                    column-gap: 10px;
                         @media (max-width: 600px) {column-gap:2%;}
                         @media (max-width: 400px) {column-gap:1%;}`
                         
export const FirstLine = styled.p`margin-top:140px;grid-column: 2/7;
                                  grid-row:1;font-size: 40px;
                         @media (max-width: 800px) {}
                         @media (max-width: 600px) {grid-column:2/7;
                                                    font-size:35px;margin-top:200px;}
                         @media (max-width: 400px) { font-size:35px;}`
export const SecondLine = styled.p`grid-column:2/7;grid-row:2;
                                   margin-top:15px;font-size: 29px;
                          @media (max-width: 800px) {}
                          @media (max-width: 600px) {grid-column:2/7;font-size:32px;
                                                     margin-top:0px;}
                          @media (max-width: 400px) {margin-top:-5px; margin-left:2px;
                                                     font-size:28px;
                                                     grid-column:1/8;}`
                                                     
export const ItemLink = styled(Link)`${p=>p.$value&&'cursor:wait'};
                                     grid-column:5/6;grid-row:3;
                                     margin-top:-90px;font-size:28px;
                        @media (max-width: 600px) {margin-top:-120px;}
                        @media (max-width: 400px) {margin-top:-200px;}`
                        
export const SeedLink = styled(Link)`grid-column:3/4;grid-row:3;
                                         margin-top:-90px;font-size:28px;
                        @media (max-width: 600px) {margin-top:-120px;}
                        @media (max-width: 400px) {margin-top:-200px;}`
                        
export const ImageCont = styled.section`position: relative;
                                        width:200px;height:180px;
                                        border-style: groove;
                           @media (max-width: 600px) {width:150px;height:140px;}
                           @media (max-width: 400px) {width:120px;height:115px;}`


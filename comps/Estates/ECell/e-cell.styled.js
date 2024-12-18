import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'

export const Cell = styled.li`font-size: 20px; 
                              border: 2px solid 
                              ${p=>p.$emptyData === 0? 'red': 'black'};
                              
                              text-align:center;height: 365px;
                              width:85%;padding:10px;
                              margin-top:10px;background:white;
                    @media (max-width: 600px) {font-size: 18px;padding:3px;
                                               width:95%;height:385px;}
                    @media (max-width: 400px) {font-size: 20px;width:85%;
                                               height:360px;}`
export const StyledImage = styled(Image)`margin:7px 10px 13px 10px;
                                         height:200px;width:80%;cursor:pointer;`
export const FourButtons = styled.section`display:flex;`
export const StyledButtons = styled.section`margin-left:10%;margin-top:7px;
                                            height:194px;width:80%;cursor:unset;`
export const DetailsLink = styled(Link)`
                         @media (max-width: 600px) {font-size: 18px;}`
export const InnerButt = styled.button`width:100%;height:50%;
                                       font-size:21px;border-style:groove;
                                       border-bottom:none;cursor:zoom-in;`                                        
export const UnitsLink = styled(Link)`
                         @media (max-width: 600px) {font-size: 18px;}`
export const SuperButts = styled.section``
export const KingButt = styled.button`border-style:groove;margin:3px;font-size:21px;
                                      color: gold;background:black;height:40px;
                                      `
export const Title = styled.section`font-size:24px;`
export const Parag = styled.p`margin: 8px;`

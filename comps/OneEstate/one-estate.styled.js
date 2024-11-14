'use client'
import Image from 'next/image'
import styled from 'styled-components'
import {Link} from '../../navigation'

export const Container = styled.div`display:grid;grid-template-columns: 60% 50%;
                                    width:75%;
                                    margin-top:0%;
       @media (max-width:1000px) {grid-template-columns: 55% 50%;}
       @media (max-width:800px) {display: block;}
       @media (max-width:400px) {width:80%;}`
export const EstateCont = styled.div`margin-left:38%;
       @media (max-width:1000px) {margin-left:15%;}
       @media (max-width:800px) {margin-left:32%;}
       @media (max-width:600px) {position:relative;top:40px;
                                 left:-5%;}
       @media (max-width:400px) {left:-15%;}`
export const EstateImg = styled(Image)`;
       @media (max-width:1000px) {height:220px;width:220px;}
       @media (max-width:800px) {height:350px;width:350px;}
       @media (max-width:600px) {height:250px;width:250px;}
       @media (max-width:400px) {height:220px;width:220px;}`
export const Label = styled.label`color: white;background:black;
                                  margin:2px;padding:3px;`
export const Paragraph = styled.p`margin:2px;`
export const StyledLink = styled(Link)`display: block;
                                       margin:20px 0px -40px 25%;
                                       color: green;
       @media (max-width:400px) {margin-left:15%;}`
export const Pictures = styled.div`display: flex; position:relative;
                                   top:110px;left:10px;
                        @media (max-width:1000px) {}
                        @media (max-width:800px) {top:80px;left:10%;}
                        @media (max-width:600px) {top:100px;left:10%;}
                        @media (max-width:400px) {display: block;}`
export const ImgName = styled.p`margin: -5px 0px -5px 20px;`
export const RoomImage = styled(Image)`
       @media (max-width:800px) {height:230px;width:230px;}
       @media (max-width:600px) {height:180px;width:180px;}
       @media (max-width:500px) {height:150px;width:150px;}
       @media (max-width:400px) {height:220px;width:220px;}`


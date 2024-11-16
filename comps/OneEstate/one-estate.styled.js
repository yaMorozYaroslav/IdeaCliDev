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
export const BigPicture = styled(Image)`z-index:3;position:absolute;
                                        width:500px;height:500px;
                                        margin:100px 0% 0px 45%;
       @media (max-width:1000px) {margin-left:35%;}
       @media (max-width:800px) {width:520px;height:520px;
                                 margin-top:75px;margin-left:6%;}
       @media (max-width:600px) {width:420px;height:420px;
                                 margin-top:100px;}
       @media (max-width:500px) {width:350px;height:350px;}
       @media (max-width:400px) {width:83%;height:300px;position:fixed;top:100px;}`
export const ClosePicture = styled.button`position:absolute;top:80px;left:60px;
                                          z-index:2;
       @media (max-width:400px) {position:fixed;}`
export const ShownPicture = styled(Image)`position: absolute;left:45px;top:72px;
                                          z-index:1;cursor: pointer;
                                          width:350px;height:350px;
       @media (max-width:800px) {height:400px;width:400px;}
       @media (max-width:600px) {height:300px;width:300px;}
       @media (max-width:500px) {height:250px;width:250px;}
       @media (max-width:400px) {position:fixed;left:8%;}`
export const ImgName = styled.p`margin: -5px 0px -5px 20px;`
export const RoomImage = styled(Image)`cursor:pointer;
       @media (max-width:800px) {height:230px;width:230px;}
       @media (max-width:600px) {height:180px;width:180px;}
       @media (max-width:500px) {height:150px;width:150px;}
       @media (max-width:400px) {height:220px;width:220px;}`


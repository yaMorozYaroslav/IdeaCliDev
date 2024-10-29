'use client'
import styled from 'styled-components'
import {Link} from '../../../navigation'

export const Mailer = styled.form`position:fixed;
                                  top:150px;left:30%;
                                  width:40%;
                                  padding:20px;
                                  text-align:center;
                                  background: green;
                      @media (max-width:800px){width:50%;left:23%;}
                      @media (max-width:600px){width:60%;left:16%;top:250px;}`
export const Input = styled.input`font-size:25px;width:70%;background:white;
                     @media (max-width:800px){width:80%;}
                     @media (max-width:600px){width:90%;}`
export const Select = styled.select`font-size:23px;width:60%;
                                    margin:5px 0px 5px 0%;background:white;`
export const Option = styled.option``
export const Textarea = styled.textarea`display:none;width:70%;margin-left:14%;`
export const Button = styled.button`font-size:25px;margin:5px;margin-bottom:20px;
                                    padding:5px;`
//~ export const PayLink = styled(Link)``

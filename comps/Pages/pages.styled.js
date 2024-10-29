import styled from 'styled-components'

export const Container = styled.div`display:inline;margin:5px;font-size:30px;
                                    `

export const Button = styled.button`margin:5px;margin-top:0px; font-size:28px;
                                    cursor:pointer; 
                                    color:${props => props.$stata ? 'blue': 'black'}`

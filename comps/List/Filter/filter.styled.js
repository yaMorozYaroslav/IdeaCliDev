import styled from 'styled-components'

export const Container = styled.div`margin-left: 20px;`
export const Panel = styled.div`
                                position: fixed;
                                top: 35%;
                                left:33%;
                                border-style:dotted;
                                text-align:center;
                                background: green;
                                width:35%;
                                padding:10px;
                                padding-top:25px;
                             @media (max-width: 800px) {display: block;
                                                        width:40%;}
                             @media (max-width: 600px) {left:25%;top:300px;
                                                        width:50%;}
                             @media (max-width: 400px) {width:70%;
                                                        left:11%;top:260px;}`

export const Label = styled.label`margin:0.5%;font-size:24px;color:white;`
export const ShowBut = styled.button`font-size:22px; 
                                     margin-top: -5px;
                                     margin:5px;
                                     margin-right: ${p => p.$show ? '84px' : '20px'};
                                     padding:0px;
                                     height:88%;
                                     width:92%;
			                         border: 2px solid groove;
			           @media (max-width: 600px) {font-size:20px}
			           @media (max-width: 400px) {font-size:18px;padding:10px;
			                                      padding-left:2px;
			                                      margin-left:-5px}`
			                         
export const FiltBut = styled.button`font-size:22px; 
                                     margin:10px;
                                     width:150px;
			                         border: 2px solid white;`
export const Select = styled.select`font-size:21px;background:white;margin-top:9px;`
export const Input = styled.input`margin:0.5%;font-size:22px;width:60%;background:yellow;
                             @media (max-width: 600px) {}`

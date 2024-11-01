import styled from 'styled-components'

export const ExtraCont = styled.div`width:100%;height:100%;
                                    display:flex;justify-content:center;`
export const Container = styled.div`
                                    position: fixed;
                                    top:150px;
                                    background: white;
                                    display: block;
		                            text-align:center;
		                            width:40%;
		                            border:solid;
		                            z-index:1;
		                 @media (max-width:1000px) {width:50%;}
		                 @media (max-width:800px) {width:55%;}
		                 @media (max-width:600px) {width:70%;top:180px;}
		                 @media (max-width:400px) {width:85%;top:180px;}
                       `
export const Title = styled.h1`font-size:30px`
export const Form = styled.form`font-size:24px;padding:5px;
                    @media (max-width:800px){}`
export const Textarea = styled.textarea`fontSize:22px;margin-left:-10px;
                                        height:50px;width:50%;
                        @media (max-width:600px){width:70%;}`
export const Selector = styled.section`display:flex;justify-content:center;
                                       position:relative;top:5px;
                        @media (max-width:1000px){display:inline;}`
export const PhotoBut = styled.label`border:solid;margin-right:2%;
                                     height:30px;
                                     background:lightgrey;border-radius:12px;
                                     padding:4px 5px 0px 5px;
                                     font-size:20px;cursor:pointer;
                        @media (max-width:1000px){padding-top:0px;}`
export const Selected = styled.section`margin-top:10px;`

export const Submit = styled.button`font-size:26px;margin:14px;cursor:pointer;
                      @media (max-width:400px){font-size:24px;margin:3px;}
                      @media (max-width:1000px){position:relative;top:-12px;}`
export const Close = styled.button`font-size:26px;margin:10px;cursor:pointer;
                     @media (max-width:1000px){position:relative;top:-12px;}
                     @media (max-width:400px){font-size:24px;margin:5px;}`

import styled from 'styled-components'

export const Container = styled.div`padding-top:1px;
                                    width:100%;
                                    margin-bottom:5px;
                         @media (max-width:600px) {margin-top:25px;}
                         @media (max-width:400px) {}`
                         
export const ListButts = styled.section`display:grid;
                                        grid-template-columns:9% 10% 60%;
                                        
                                        margin-top:90px;margin-left:7px;
                         @media (max-width:600px) {margin-top:156px;
                         @media (max-width:400px) {margin-left:-15px;`
                      
export const AddAdmin = styled.button`grid-column:1;font-size:23px;border-style: dashed;
                                      padding:10px;background: white;
                                      height:63px;margin-top:5px;
                        @media (max-width: 600px) {font-size:20px;}
                        @media (max-width: 400px) {font-size:18px;padding:5px;
                                                   margin-left:-7px;}
                                                   margin-left:-7px;}`
export const NotLink = styled.p`grid-column:2;grid-row:1;margin:5px;
                                font-size: 24px;padding: 15px;text-align: center;
                                border:1px solid olive;
                                color:black; background:white;
                        @media (max-width: 400px){font-size:20px; padding: 18px;
                                                  padding-left:5px;padding-right:5px}`                                    
                                                 
export const Title = styled.p`grid-column:3; text-align:center; 
                              margin:5px 0px -5px 0px;font-size: 40px;`
export const List = styled.ul` display: grid;
                               grid-template-columns: repeat(4,24%);
                               grid-template-rows: 400px;
                               column-gap:0.5%;
                               margin: 0% 0% 15px 0px;
                               align:center;
                               list-style: none;
                    @media (max-width: 1000px) {grid-template-columns: repeat(2, 47%);
                                                margin-left:4%;}
                    @media (max-width: 800px) {} 
                    @media (max-width: 600px) {margin-left:-4%;column-gap:2%;row-gap:5px;}
                    @media (max-width: 400px) {display:block;
                                               margin-left:-5%;}`

export const NoData = styled.p`margin-top:30px;padding-top:140px;height:213px;
                               font-size:32px;
                               text-align:center;position:relative;z-index:-1;`
export const SpinCont = styled.div`display:flex;justify-content:center;height:415px;
                        @media (max-width: 1000px) {height:520px;}
                        @media (max-width: 400px) {height:500px;}`
export const Spinner = styled.div`
                              border: 16px solid #f3f3f3; /* Light grey */
                              border-top: 16px solid #3498db; /* Blue */
                              border-radius: 50%;
                              margin-top:60px;
                              width: 200px;
                              height: 200px;
                              animation: spin 2s linear infinite;
                       @media (max-width: 1000px) {width: 200px;height:200px;margin-top:30px;}
                       @media (max-width: 600px) {width:200px;height:200px;margin-top:5px;}
                       @media (max-width: 400px) {width:180px;height:180px;margin-top:5px;}
                       @keyframes spin {
                               0% { transform: rotate(0deg); }
                               100% { transform: rotate(360deg); }
                              }`

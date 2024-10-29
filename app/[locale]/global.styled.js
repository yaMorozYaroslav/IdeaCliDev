'useClient'

import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
button,select{cursor: pointer;}
.styledLink{text-decoration:none;}
.styledLink:hover{color:green;}
.file-base label{},
          input[type="file" i]::-webkit-file-upload-button{border-radius:20px;
                                                         margin-left:5%;}
`
//~ export const GlobalStyle = createGlobalStyle`
//~ button,select{cursor: pointer}
//~ .styledLink{text-decoration:none;}
//~ .styledLink:hover{color:green;}
//~ .file-base label{},
          //~ input[type="file" i]::-webkit-file-upload-button{border-radius:20px;
                                                         //~ margin-left:5%;}
//~ `

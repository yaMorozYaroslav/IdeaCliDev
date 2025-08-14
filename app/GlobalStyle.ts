// app/GlobalStyle.ts (styled-components v6)
import * as StyledComponents from "styled-components";
const { createGlobalStyle } = StyledComponents as any;

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    overflow-x: hidden;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  
    body { padding-top: 45px;
    @media (max-width: 768px) {
      padding-top: 110px; /* adjust to match your mobile header height */
    }
  }
`;

export default GlobalStyle;

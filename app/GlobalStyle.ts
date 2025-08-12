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

  
    body { padding-top: 72px;
    @media (max-width: 770px) {
      padding-top: 110px; /* adjust to match your mobile header height */
    }
  }
`;

export default GlobalStyle;

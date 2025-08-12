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

  /* Universal offset for the fixed header */
  body {
    padding-top: 72px;
  }

  @media (max-width: 400px) {
    body { padding-top: 68px; }
  }

  @media (max-width: 300px) {
    body { padding-top: 64px; }
  }
`;

export default GlobalStyle;

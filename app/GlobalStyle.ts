// app/GlobalStyle.ts  (ESM/CJS-safe for styled-components v6)
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
`;

export default GlobalStyle;

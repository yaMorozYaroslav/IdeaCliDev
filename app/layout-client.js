"use client";

import { useState, useEffect } from "react";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import Header from '/comps/Header'
import styled from "styled-components";

export const ContentSpacer = styled.div`
  height:800px; /* This should match the header height */
`;

export default function LayoutClient({ children, user }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={user} />
      <ContentSpacer/>
      {children}
    </StyleSheetManager>
  );
}

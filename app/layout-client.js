"use client"; // Ensure it's a client component

import { useState, useEffect } from "react";
import Header from "../comps/Header";
import { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { usePathname } from "next/navigation";
import { refreshToken } from "/lib/refreshToken"

export default function LayoutClient({ user, children }) {
 
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  
  
  return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
      <Header user={user} />
      {children}
    </StyleSheetManager>
  );
}

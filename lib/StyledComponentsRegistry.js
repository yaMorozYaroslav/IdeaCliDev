"use client";

import { useServerInsertedHTML } from "next/navigation";
import React, { useState, useRef } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }) {
  const [styledSheet] = useState(() => new ServerStyleSheet());
  const styledRef = useRef(false);

  useServerInsertedHTML(() => {
    if (styledRef.current) return;
    styledRef.current = true;
    const styles = styledSheet.getStyleElement();
    styledSheet.instance.clearTag();
    return <>{styles}</>;
  });

  return <StyleSheetManager sheet={styledSheet.instance}>{children}</StyleSheetManager>;
}

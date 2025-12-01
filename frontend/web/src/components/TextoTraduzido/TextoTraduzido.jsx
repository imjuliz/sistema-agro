// "use client"

// import { useTranslation } from '@/hooks/useTranslation';
// import { useState, useEffect } from 'react';

// export function Transl({ children }) {
//   const { translate } = useTranslation();
//   const [text, setText] = useState(children);

//   useEffect(() => {
//     translate(children).then(setText);
//   }, [children, translate]);

//   return <>{text}</>;
// }
"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useState, useEffect } from "react";

export function Transl({ children }) {
  const { translate } = useTranslation();
  const [text, setText] = useState(() => (typeof children === "string" ? children : String(children)));

  useEffect(() => {
    let mounted = true;

    const sourceText = typeof children === "string" ? children : String(children);

    // if already same, skip
    if (sourceText === (text ?? "")) {
      // but still keep state in sync if necessary
    }

    (async () => {
      try {
        const t = await translate(sourceText);
        if (!mounted) return;
        setText(t);
      } catch (e) {
        if (!mounted) return;
        setText(sourceText);
      }
    })();

    return () => {
      mounted = false;
    };
    // note: translate is stable (memoized), children may change
  }, [children, translate]);

  return <>{text}</>;
}

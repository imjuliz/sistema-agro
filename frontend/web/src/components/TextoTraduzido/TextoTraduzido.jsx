"use client"

import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect } from 'react';

export function Transl({ children }) {
  const { translate } = useTranslation();
  const [text, setText] = useState(children);

  useEffect(() => {
    translate(children).then(setText);
  }, [children, translate]);

  return <>{text}</>;
}

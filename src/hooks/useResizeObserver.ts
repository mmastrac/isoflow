import { useState, useEffect, useRef } from 'react';
import { Size } from 'src/types';

export const useResizeObserver = (element: HTMLElement | null | undefined) => {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      });
    });

    resizeObserver.observe(element);
    resizeObserverRef.current = resizeObserver;

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [element]);

  return { size };
};

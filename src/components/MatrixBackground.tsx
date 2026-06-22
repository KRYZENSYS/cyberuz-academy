'use client';

import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>=/{}[]';
    const charArray = chars.split('');

    const createChar = () => {
      const char = document.createElement('span');
      char.className = 'matrix-char';
      char.textContent = charArray[Math.floor(Math.random() * charArray.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.animationDuration = `${Math.random() * 8 + 4}s`;
      char.style.animationDelay = `${Math.random() * 5}s`;
      char.style.fontSize = `${Math.random() * 6 + 10}px`;
      container.appendChild(char);

      setTimeout(() => {
        char.remove();
      }, 13000);
    };

    // Initial burst
    for (let i = 0; i < 30; i++) {
      setTimeout(createChar, i * 200);
    }

    const interval = setInterval(createChar, 200);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="matrix-bg" aria-hidden="true" />;
}
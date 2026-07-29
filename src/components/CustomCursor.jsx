'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let dotPos = { x: mouse.x, y: mouse.y };
    let ringPos = { x: mouse.x, y: mouse.y };
    let animId = null;
    let isAnimating = false;

    const lerp = (a, b, t) => a + (b - a) * t;

    const render = () => {
      const dxDot = mouse.x - dotPos.x;
      const dyDot = mouse.y - dotPos.y;
      const dxRing = mouse.x - ringPos.x;
      const dyRing = mouse.y - ringPos.y;

      dotPos.x = lerp(dotPos.x, mouse.x, 0.9);
      dotPos.y = lerp(dotPos.y, mouse.y, 0.9);

      ringPos.x = lerp(ringPos.x, mouse.x, 0.12);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.12);

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      if (Math.abs(dxDot) < 0.05 && Math.abs(dyDot) < 0.05 && Math.abs(dxRing) < 0.05 && Math.abs(dyRing) < 0.05) {
        isAnimating = false;
        animId = null;
      } else {
        animId = requestAnimationFrame(render);
      }
    };

    const startAnimating = () => {
      if (!isAnimating) {
        isAnimating = true;
        animId = requestAnimationFrame(render);
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      startAnimating();
    };

    const interactiveSelector = 'a, button, input, textarea, [data-magnetic], .service-card, .testimonial-card';

    const handleMouseOver = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hovering');
      }
    };

    const handleMouseOut = (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(interactiveSelector)) {
          document.body.classList.remove('cursor-hovering');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    startAnimating();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}


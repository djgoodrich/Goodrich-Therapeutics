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
    let animId;

    const lerp = (a, b, t) => a + (b - a) * t;

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseEnter = () => document.body.classList.add('cursor-hovering');
    const handleMouseLeave = () => document.body.classList.remove('cursor-hovering');

    window.addEventListener('mousemove', handleMouseMove);

    const interactiveSelector = 'a, button, input, textarea, [data-magnetic], .service-card, .testimonial-card';
    const attachHover = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    function render() {
      dotPos.x = lerp(dotPos.x, mouse.x, 0.9);
      dotPos.y = lerp(dotPos.y, mouse.y, 0.9);

      ringPos.x = lerp(ringPos.x, mouse.x, 0.12);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.12);

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      animId = requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

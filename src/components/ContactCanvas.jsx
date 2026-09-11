'use client';

import { useEffect, useRef } from 'react';

export default function ContactCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    let w, h, time = 0, isVisible = false, rafId = null;
    let initialized = false;

    function resize() {
      w = canvas.parentElement?.offsetWidth || window.innerWidth;
      h = canvas.parentElement?.offsetHeight || window.innerHeight * 0.8;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const colors = ['rgba(122,158,126,0.3)', 'rgba(200,169,110,0.2)', 'rgba(122,158,126,0.15)'];

    function draw() {
      if (!isVisible) {
        rafId = null;
        return;
      }
      ctx.clearRect(0, 0, w, h);
      time += 0.003;

      for (let i = 0; i < 3; i++) {
        const x = (Math.sin(time + i * 2) * 0.3 + 0.5) * w;
        const y = (Math.cos(time * 0.8 + i * 1.5) * 0.3 + 0.5) * h;
        const radius = Math.min(w, h) * 0.5;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, colors[i]);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }
      rafId = requestAnimationFrame(draw);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
          if (isVisible) {
            if (!initialized) {
              resize();
              initialized = true;
              window.addEventListener('resize', resize, { passive: true });
            }
            if (!rafId) draw();
          }
        });
      },
      { threshold: 0 }
    );
    obs.observe(canvas.parentElement || canvas);

    return () => {
      window.removeEventListener('resize', resize);
      obs.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} id="contact-gradient" aria-hidden="true" />;
}

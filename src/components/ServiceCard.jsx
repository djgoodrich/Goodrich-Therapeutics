'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ServiceCard({ pattern, title, desc, link, delay = 0 }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    let time = 0;
    let isVisible = false;
    let rafId = null;

    function resize() {
      w = canvas.clientWidth || canvas.parentElement.clientWidth;
      h = canvas.clientHeight || 200;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    let points = [];
    if (pattern === 'geometry') {
      for (let i = 0; i < 30; i++) {
        points.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    }

    function draw() {
      if (!isVisible) {
        rafId = null;
        return;
      }
      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      if (pattern === 'contour') {
        ctx.strokeStyle = 'rgba(122,158,126,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 20; i++) {
          const yOff = (i / 20) * h;
          for (let x = 0; x < w; x += 5) {
            const y = yOff + Math.sin(x * 0.015 + time + i) * 20 + Math.sin(x * 0.008 - time * 0.5) * 15;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      } else if (pattern === 'geometry') {
        ctx.strokeStyle = 'rgba(122,158,126,0.08)';
        ctx.fillStyle = 'rgba(122,158,126,0.25)';
        ctx.lineWidth = 1;

        points.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const dx = points[i].x - points[j].x;
            const dy = points[i].y - points[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < 120) {
              ctx.moveTo(points[i].x, points[i].y);
              ctx.lineTo(points[j].x, points[j].y);
            }
          }
        }
        ctx.stroke();
      } else if (pattern === 'flow') {
        ctx.strokeStyle = 'rgba(122,158,126,0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 15; i++) {
          for (let x = 0; x < w; x += 10) {
            const y = h / 2 + Math.sin(x * 0.01 + time + i * 0.5) * (50 + i * 5) + Math.cos(x * 0.02 - time) * 20;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) draw();
        });
      },
      { threshold: 0 }
    );
    observer.observe(cardRef.current || canvas);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pattern]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <article ref={cardRef} className="service-card" data-animate="fade-up" data-delay={delay}>
      <canvas ref={canvasRef} className="service-canvas" aria-hidden="true" />
      <div className="service-content">
        <h3 className="service-name" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="service-desc">{desc}</p>
        <Link href={link} className="service-cta" data-magnetic>
          Learn more <span className="arrow">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}

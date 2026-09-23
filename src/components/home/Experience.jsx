'use client';

/**
 * Experience — the homepage's motion + interaction engine.
 *
 * Renders the fixed layers (aura + fibre canvases, grain, intro curtain, veil, cursor)
 * and, on mount, wires up everything interactive on the server-rendered page:
 *   1. inertial smooth scroll          5. cursor + magnetic buttons
 *   2. WebGL aura + fibre ribbon       6. GSAP ScrollTrigger choreography
 *   3. Sensory Selector (2D canvas)    7. entry curtain + veil transitions
 *   4. Therapeutics / FAQ accordions   8. one shared requestAnimationFrame loop
 *
 * All per-frame work reads cached values only (no layout reads inside the loop),
 * pauses when the tab is hidden, and degrades for reduced-motion / touch / no-WebGL.
 */

import { useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { THERAPIES, PALETTES } from '@/data/therapies';

const hex = (h) => { const n = parseInt(h.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; };
const rgbStr = (c) => `${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(c.b * 255)}`;

export default function Experience() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root = document.documentElement;
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];

    /* cleanup plumbing */
    const offs = [];
    const on = (t, type, fn, opts) => { t.addEventListener(type, fn, opts); offs.push(() => t.removeEventListener(type, fn, opts)); };
    const every = (fn, ms) => { const id = setInterval(fn, ms); offs.push(() => clearInterval(id)); };
    const ctx = gsap.context(() => {});

    /* live theme — tweened by the selector, read every frame by WebGL + canvas */
    const theme = {};
    for (const k of ['c1', 'c2', 'c3', 'base', 'accent', 'accent2']) theme[k] = hex(PALETTES.neutral[k]);
    const pushCSS = () => { root.style.setProperty('--accent', rgbStr(theme.accent)); root.style.setProperty('--accent-2', rgbStr(theme.accent2)); };
    const themeMeta = $('meta[name="theme-color"]');
    function setPalette(key, dur = 1.8) {
      const p = PALETTES[key];
      for (const k of Object.keys(theme)) {
        const t = hex(p[k]);
        gsap.to(theme[k], { r: t.r, g: t.g, b: t.b, duration: dur, ease: 'power2.inOut', overwrite: true,
          onUpdate: k === 'accent' || k === 'accent2' ? pushCSS : undefined });
      }
      themeMeta && themeMeta.setAttribute('content', p.base);
    }

    const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0.5, sy: 0.5, moved: 0 };
    let vw = innerWidth, vh = innerHeight;

    /* ════════ 1. INERTIAL SMOOTH SCROLL (window-native → sticky + ScrollTrigger just work) ════════ */
    const Smooth = (() => {
      const enabled = FINE && !REDUCED;
      let target = scrollY, current = scrollY, driving = false, locked = false;
      const max = () => root.scrollHeight - innerHeight;
      if (enabled) {
        on(window, 'wheel', (e) => {
          if (e.ctrlKey || locked) return;
          e.preventDefault();
          const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
          target = Math.max(0, Math.min(max(), target + d));
          driving = true;
        }, { passive: false });
        on(window, 'scroll', () => { if (!driving) target = current = scrollY; }, { passive: true });
      }
      return {
        tick() {
          if (!enabled || !driving) return;
          current += (target - current) * 0.085;
          if (Math.abs(target - current) < 0.4) { current = target; driving = false; }
          window.scrollTo(0, current);
        },
        scrollTo(y, immediate) {
          y = Math.max(0, Math.min(max(), y));
          if (!enabled || immediate) { target = current = y; driving = false; window.scrollTo(0, y); return; }
          target = y; driving = true;
        },
        lock: (v) => { locked = v; },
        get y() { return enabled ? current : scrollY; },
      };
    })();

    /* ════════ 2. WEBGL — aura field (half-res) + fibre ribbon ════════ */
    const GL = (() => {
      const auraCanvas = $('#aura'), fiberCanvas = $('#fiber');
      let auraR, fiberR;
      try {
        auraR = new THREE.WebGLRenderer({ canvas: auraCanvas, antialias: false, powerPreference: 'high-performance' });
        fiberR = new THREE.WebGLRenderer({ canvas: fiberCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      } catch {
        return null;
      }
      auraR.setPixelRatio(0.5);                                   // soft field → cheap to render, CSS upscales
      fiberR.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      fiberR.setClearColor(0x000000, 0);

      const auraScene = new THREE.Scene();
      const auraCam = new THREE.Camera();
      const U = {
        uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uScroll: { value: 0 },
        uC1: { value: new THREE.Color() }, uC2: { value: new THREE.Color() }, uC3: { value: new THREE.Color() }, uBase: { value: new THREE.Color() },
      };
      const auraGeo = new THREE.PlaneGeometry(2, 2);
      const auraMat = new THREE.ShaderMaterial({
        uniforms: U, depthTest: false, depthWrite: false,
        vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: /* glsl */`
          uniform vec2 uRes, uMouse; uniform float uTime, uScroll;
          uniform vec3 uC1, uC2, uC3, uBase;
          float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
          float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x), u.y); }
          float fbm(vec2 p){ float v=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
            for(int i=0;i<5;i++){ v+=a*noise(p); p=m*p; a*=0.5; } return v; }
          void main(){
            vec2 uv = gl_FragCoord.xy / uRes;
            float asp = uRes.x / uRes.y;
            vec2 p = vec2(uv.x*asp, uv.y + uScroll*0.35);
            vec2 m = vec2(uMouse.x*asp, uMouse.y + uScroll*0.35);
            float t = uTime*0.045;
            float breath = 0.5 + 0.5*sin(uTime*0.785);                 // ~8s breath cycle
            vec2 toM = (m - p); float md = length(toM);
            vec2 pull = toM * 0.22 * exp(-md*md*2.2);                   // warp leans toward the cursor
            vec2 q = vec2(fbm(p*1.15 + t + pull), fbm(p*1.15 - t + vec2(3.1,1.7)));
            vec2 r = vec2(fbm(p*1.5 + 2.0*q + vec2(1.7,9.2) + t*1.4), fbm(p*1.5 + 2.0*q + vec2(8.3,2.8) - t));
            float f = fbm(p*1.05 + 2.1*r + pull*2.0);
            float glow = exp(-md*md*3.2);
            vec3 col = uBase;
            col = mix(col, uC3, smoothstep(0.15, 0.85, f));
            col = mix(col, uC2, smoothstep(0.45, 1.15, length(q)) * 0.55);
            col = mix(col, uC1, smoothstep(0.62, 1.05, f + r.x*0.35 + glow*0.25) * (0.35 + 0.15*breath));
            col += uC1 * glow * (0.10 + 0.05*breath);
            float vig = smoothstep(1.25, 0.25, length((uv-0.5)*vec2(asp*0.75,1.0)));
            col *= mix(0.45, 1.0, vig);
            col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.02;
            gl_FragColor = vec4(col, 1.0);
          }`,
      });
      auraScene.add(new THREE.Mesh(auraGeo, auraMat));

      /* fibre bundle: N thin tubes merged into one draw call, shaped entirely in the vertex shader */
      const fiberScene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 50); cam.position.set(0, 0, 6.2);
      const N = matchMedia('(max-width: 767px)').matches ? 34 : 56;
      const base = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0)), 240, 0.011, 5, false);
      const bp = base.attributes.position.array, bn = base.attributes.normal.array, bi = base.index.array;
      const vc = bp.length / 3;
      const pos = new Float32Array(bp.length * N), nor = new Float32Array(bn.length * N);
      const aF = new Float32Array(vc * N), aS = new Float32Array(vc * N), aR = new Float32Array(vc * N);
      const idx = new Uint32Array(bi.length * N);
      for (let f = 0; f < N; f++) {
        pos.set(bp, f * bp.length); nor.set(bn, f * bn.length);
        const s = Math.random(), rr = 0.25 + Math.sqrt(Math.random()) * 0.75;
        aF.fill(f / N, f * vc, (f + 1) * vc); aS.fill(s, f * vc, (f + 1) * vc); aR.fill(rr, f * vc, (f + 1) * vc);
        for (let i = 0; i < bi.length; i++) idx[f * bi.length + i] = bi[i] + f * vc;
      }
      base.dispose();
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
      geo.setAttribute('aFiber', new THREE.BufferAttribute(aF, 1));
      geo.setAttribute('aSeed', new THREE.BufferAttribute(aS, 1));
      geo.setAttribute('aRadius', new THREE.BufferAttribute(aR, 1));
      geo.setIndex(new THREE.BufferAttribute(idx, 1));

      const FU = {
        uTime: { value: 0 }, uIntro: { value: 0 }, uOpacity: { value: 1 }, uRelax: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) }, uLen: { value: 5.8 }, uTwist: { value: 0.55 },
        uC1: { value: new THREE.Color() }, uC2: { value: new THREE.Color() },
      };
      const fiberMat = new THREE.ShaderMaterial({
        uniforms: FU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */`
          attribute float aFiber, aSeed, aRadius;
          uniform float uTime, uIntro, uRelax, uLen, uTwist; uniform vec2 uMouse;
          varying float vT, vFiber, vFres, vSheen, vNear;
          void main(){
            float t = position.x, x = t*uLen, tm = uTime;
            vec3 c = vec3(x, sin(x*0.55 + tm*0.35)*0.5 + sin(x*1.3 - tm*0.2)*0.1, cos(x*0.42 + tm*0.25)*0.55);
            float md = distance(vec2(x, c.y), uMouse);
            float loosen = exp(-md*md*0.55) * uRelax;                   // fibres relax near the cursor
            float breath = 0.5 + 0.5*sin(tm*0.785);
            float body = 1.0 - t*t*0.82;                                // spindle-shaped muscle belly
            float r = (0.08 + 0.4*body) * (0.9 + 0.12*breath) * (1.0 + loosen*1.4) * aRadius * uIntro;
            float ang = aFiber*6.28318 + x*uTwist*(1.0 - loosen*0.6) + tm*0.12 + aSeed*0.4;
            vec3 off = vec3(0.0, cos(ang), sin(ang)) * r;
            off.y += sin(x*2.6 + aSeed*12.0 + tm*0.9) * (0.018 + loosen*0.06);
            vec3 p = c + off + vec3(0.0, position.y, position.z) * (0.55 + aSeed*0.9);
            vT = t; vFiber = aFiber; vNear = loosen;
            vFres = 1.0 - abs(normal.z);
            vSheen = pow(max(0.0, sin(x*0.9 - tm*1.05 + aSeed*6.28)), 14.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }`,
        fragmentShader: /* glsl */`
          uniform vec3 uC1, uC2; uniform float uOpacity;
          varying float vT, vFiber, vFres, vSheen, vNear;
          void main(){
            float ends = smoothstep(1.0, 0.62, abs(vT));
            vec3 col = mix(uC2*1.6, uC1, clamp(vFres*0.7 + vFiber*0.3, 0.0, 1.0));
            col += vec3(1.0, 0.95, 0.88) * (vSheen*0.9 + vNear*0.25);
            float a = (0.09 + 0.34*vFres + vSheen*0.5) * ends * uOpacity;
            gl_FragColor = vec4(col, a);
          }`,
      });
      const group = new THREE.Group(); group.add(new THREE.Mesh(geo, fiberMat)); fiberScene.add(group);

      let baseY = 0.2;
      function resize() {
        auraR.setSize(vw, vh, false); U.uRes.value.set(vw * 0.5, vh * 0.5);
        fiberR.setSize(vw, vh, false); cam.aspect = vw / vh; cam.updateProjectionMatrix();
        const portrait = vw < vh;
        baseY = portrait ? 1.2 : 0.2;
        group.position.set(portrait ? 0.3 : 1.35, baseY, 0);
        group.rotation.z = portrait ? -0.28 : -0.62;
        group.scale.setScalar(portrait ? 0.55 : 1);
        FU.uLen.value = portrait ? 4.4 : 5.8;
      }

      const halfH = Math.tan(THREE.MathUtils.degToRad(17.5)) * 6.2;
      const tensionEl = $('#tension-val'), tensionBar = $('#tension-bar');
      let relax = 0, fiberVisible = true, tension = 0.72, frame = 0;

      function render(time, dt) {
        U.uTime.value = time; FU.uTime.value = REDUCED ? 8 : time;
        U.uC1.value.setRGB(theme.c1.r, theme.c1.g, theme.c1.b);
        U.uC2.value.setRGB(theme.c2.r, theme.c2.g, theme.c2.b);
        U.uC3.value.setRGB(theme.c3.r, theme.c3.g, theme.c3.b);
        U.uBase.value.setRGB(theme.base.r, theme.base.g, theme.base.b);
        U.uMouse.value.set(pointer.sx, 1 - pointer.sy);
        const sy = Smooth.y;
        U.uScroll.value = sy / vh;
        auraR.render(auraScene, auraCam);

        const prog = Math.min(1, sy / (vh * 0.9));                    // fibre only while the hero is on screen
        const vis = prog < 1;
        if (vis !== fiberVisible) { fiberVisible = vis; fiberCanvas.style.visibility = vis ? 'visible' : 'hidden'; }
        if (!vis) return;
        relax += ((pointer.moved > 0 ? 1 : 0) - relax) * Math.min(1, dt * 2.2);
        pointer.moved = Math.max(0, pointer.moved - dt);
        FU.uRelax.value = relax;
        FU.uOpacity.value = 1 - prog;
        const hw = halfH * cam.aspect;
        const wx = pointer.nx * hw - group.position.x, wy = -pointer.ny * halfH - group.position.y + (sy / vh) * 1.6;
        const cz = Math.cos(-group.rotation.z), sz = Math.sin(-group.rotation.z), s = 1 / group.scale.x;
        FU.uMouse.value.set((wx * cz - wy * sz) * s, (wx * sz + wy * cz) * s);
        group.position.y += (baseY + prog * 1.6 - group.position.y) * 0.1;
        group.rotation.x += (pointer.ny * 0.18 - group.rotation.x) * 0.04;
        group.rotation.y += (pointer.nx * 0.22 - group.rotation.y) * 0.04;
        FU.uC1.value.setRGB(theme.c1.r, theme.c1.g, theme.c1.b);
        FU.uC2.value.setRGB(theme.c2.r, theme.c2.g, theme.c2.b);
        fiberR.render(fiberScene, cam);

        tension += (0.72 - relax * 0.58 - tension) * 0.05;
        if ((frame++ & 7) === 0 && tensionEl) { tensionEl.textContent = tension.toFixed(2); tensionBar.style.width = `${(tension * 100).toFixed(1)}%`; }
      }

      function dispose() {
        geo.dispose(); fiberMat.dispose(); auraGeo.dispose(); auraMat.dispose();
        auraR.dispose(); fiberR.dispose();
      }
      return { resize, render, dispose, intro: FU.uIntro };
    })();
    if (!GL) $('#aura').style.background = 'radial-gradient(80% 60% at 70% 40%, #2a2622, #0c0c0e)';

    /* ════════ Focus panel ════════ */
    const Panel = (() => {
      const el = $('[data-panel]');
      const f = (k) => document.querySelector(`[data-f="${k}"]`);
      return {
        show(n) {
          gsap.to(el, { opacity: 0, y: 12, duration: 0.28, ease: 'power2.in', overwrite: true, onComplete() {
            f('service').textContent = `${n.no} — ${n.service}`;
            f('name').textContent = n.focus;
            f('tagline').textContent = n.tagline;
            f('desc').textContent = n.desc;
            f('pace').textContent = n.pace;
            f('ns').textContent = n.ns;
            f('rates').textContent = n.rates.map((r) => `${r[0]} ${r[1]}`).join(' · ');
            [...f('depth').children].forEach((i, k) => i.classList.toggle('on', k < n.depth));
            gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
          } });
        },
      };
    })();

    /* ════════ 3. SENSORY SELECTOR ════════ */
    const Selector = (() => {
      const cv = $('#selector-stage'), wrap = $('#selector-wrap');
      const c2d = cv.getContext('2d');
      const coordEl = $('#sel-coords');
      let W = 0, H = 0, rectL = 0, rectT = 0, visible = false, active = null;
      const orb = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, vx: 0, vy: 0, drag: false };
      const nodes = THERAPIES.map((t) => ({ ...t, x: t.pos[0], y: t.pos[1], pulse: 0, btn: document.querySelector(`.node-btn[data-id="${t.id}"]`) }));

      function select(n) {
        if (active === n) { orb.tx = n.x; orb.ty = n.y; return; }
        active = n; orb.tx = n.x; orb.ty = n.y; n.pulse = 1;
        nodes.forEach((o) => { o.btn.classList.toggle('is-active', o === n); o.btn.setAttribute('aria-checked', String(o === n)); o.btn.tabIndex = o === n ? 0 : -1; });
        setPalette(n.id);
        Panel.show(n);
      }

      nodes.forEach((n, i) => {
        on(n.btn, 'click', (e) => { e.stopPropagation(); select(n); });
        on(n.btn, 'keydown', (e) => {
          const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? 2 : 0;
          if (!next) return;
          e.preventDefault();
          const m = nodes[(i + next) % 3]; m.btn.focus(); select(m);
        });
      });

      const P = [], COUNT = innerWidth < 768 ? 160 : 280;
      for (let i = 0; i < COUNT; i++) {
        P.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, home: i % 4 === 3 ? -1 : i % 3, a: Math.random() * 6.283,
          rad: 0.03 + Math.random() * 0.14, spd: 0.15 + Math.random() * 0.5, s: 0.6 + Math.random() * 1.6 });
      }

      function resize() {
        const r = wrap.getBoundingClientRect();
        W = r.width; H = r.height; const dpr = Math.min(devicePixelRatio, 2);
        cv.width = W * dpr; cv.height = H * dpr; c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const local = (e) => ({ x: (e.clientX - rectL) / W, y: (e.clientY - rectT) / H });
      const nearest = (x, y) => { let best = null, bd = 1e9; for (const n of nodes) { const d = Math.hypot((n.x - x) * W, (n.y - y) * H); if (d < bd) { bd = d; best = n; } } return best; };

      on(cv, 'pointerdown', (e) => {
        const r = cv.getBoundingClientRect(); rectL = r.left; rectT = r.top;
        const p = local(e); orb.drag = true; orb.tx = p.x; orb.ty = p.y; cv.setPointerCapture(e.pointerId);
        document.body.classList.add('c-drag');
      });
      on(cv, 'pointermove', (e) => { if (!orb.drag) return; const p = local(e); orb.tx = Math.min(0.97, Math.max(0.03, p.x)); orb.ty = Math.min(0.97, Math.max(0.03, p.y)); });
      const release = () => { if (!orb.drag) return; orb.drag = false; select(nearest(orb.x, orb.y)); };
      on(cv, 'pointerup', release); on(cv, 'pointercancel', release);
      on(cv, 'pointerenter', () => FINE && document.body.classList.add('c-drag'));
      on(cv, 'pointerleave', () => { if (!orb.drag) document.body.classList.remove('c-drag'); });

      function draw(dt, time) {
        const k = orb.drag ? 0.35 : 0.08;
        orb.vx = (orb.vx + (orb.tx - orb.x) * k) * 0.72; orb.vy = (orb.vy + (orb.ty - orb.y) * k) * 0.72;
        orb.x += orb.vx; orb.y += orb.vy;
        const c1 = theme.c1;
        const A = `${(c1.r * 255) | 0},${(c1.g * 255) | 0},${(c1.b * 255) | 0}`, L = '237,230,218';
        c2d.clearRect(0, 0, W, H);
        const near = nearest(orb.x, orb.y), ox = orb.x * W, oy = orb.y * H;

        for (const n of nodes) {                                                  // tethers
          const nx = n.x * W, ny = n.y * H, d = Math.hypot(nx - ox, ny - oy);
          const s = Math.max(0, 1 - d / (Math.max(W, H) * 0.8));
          c2d.strokeStyle = `rgba(${n === near || n === active ? A : L},${0.05 + s * 0.35})`;
          c2d.lineWidth = 1; c2d.setLineDash(n === active ? [] : [2, 6]);
          c2d.beginPath(); c2d.moveTo(ox, oy);
          c2d.quadraticCurveTo((ox + nx) / 2 + Math.sin(time * 0.6 + n.x * 9) * 18, (oy + ny) / 2 + Math.cos(time * 0.5 + n.y * 9) * 18, nx, ny);
          c2d.stroke();
        }
        c2d.setLineDash([]);

        for (const n of nodes) {                                                  // nodes
          const nx = n.x * W, ny = n.y * H, isA = n === active;
          n.pulse = Math.max(0, n.pulse - dt * 0.6);
          const R = (isA ? 34 : 22) + (0.5 + 0.5 * Math.sin(time * 0.785 + n.x * 4)) * 6;
          const g = c2d.createRadialGradient(nx, ny, 0, nx, ny, R * 3);
          g.addColorStop(0, `rgba(${isA ? A : L},${isA ? 0.35 : 0.12})`); g.addColorStop(1, `rgba(${isA ? A : L},0)`);
          c2d.fillStyle = g; c2d.beginPath(); c2d.arc(nx, ny, R * 3, 0, 6.283); c2d.fill();
          c2d.strokeStyle = `rgba(${isA ? A : L},${isA ? 0.8 : 0.25})`;
          c2d.beginPath(); c2d.arc(nx, ny, R, 0, 6.283); c2d.stroke();
          if (n.pulse > 0) { c2d.strokeStyle = `rgba(${A},${n.pulse * 0.6})`; c2d.beginPath(); c2d.arc(nx, ny, R + (1 - n.pulse) * 90, 0, 6.283); c2d.stroke(); }
        }

        c2d.globalCompositeOperation = 'lighter';                                 // particles
        for (const p of P) {
          let hx, hy;
          if (active && p.home !== -1 && Math.random() < 0.002) p.home = nodes.indexOf(active);
          if (p.home === -1) { hx = 0.5 + Math.sin(time * p.spd * 0.3 + p.a) * 0.45; hy = 0.5 + Math.cos(time * p.spd * 0.23 + p.a * 1.3) * 0.42; }
          else {
            const n = nodes[p.home], isA = n === active;
            p.a += dt * p.spd * (isA ? 0.9 : 0.4);
            const rad = p.rad * (isA ? 1.35 : 1);
            hx = n.x + (Math.cos(p.a) * rad * H) / W; hy = n.y + Math.sin(p.a) * rad;
          }
          const dx = orb.x - p.x, dy = orb.y - p.y;
          const pull = orb.drag ? Math.max(0, 1 - Math.hypot(dx * W, dy * H) / 180) * 0.02 : 0;
          p.vx = (p.vx + (hx - p.x) * 0.012 + dx * pull) * 0.9;
          p.vy = (p.vy + (hy - p.y) * 0.012 + dy * pull) * 0.9;
          p.x += p.vx; p.y += p.vy;
          c2d.fillStyle = `rgba(${p.home !== -1 && nodes[p.home] === active ? A : L},${p.home === -1 ? 0.25 : 0.55})`;
          c2d.fillRect(p.x * W, p.y * H, p.s, p.s);
        }
        c2d.globalCompositeOperation = 'source-over';

        const og = c2d.createRadialGradient(ox, oy, 0, ox, oy, 70);                // orb
        og.addColorStop(0, 'rgba(255,248,238,0.95)'); og.addColorStop(0.12, `rgba(${A},0.7)`); og.addColorStop(1, `rgba(${A},0)`);
        c2d.fillStyle = og; c2d.beginPath(); c2d.arc(ox, oy, 70, 0, 6.283); c2d.fill();
        c2d.strokeStyle = `rgba(${L},0.6)`; c2d.beginPath(); c2d.arc(ox, oy, orb.drag ? 16 : 11, 0, 6.283); c2d.stroke();

        if (((time * 10) | 0) % 2 === 0) coordEl.textContent = `x ${orb.x.toFixed(2)} · y ${(1 - orb.y).toFixed(2)}${orb.drag ? ` · → ${near.focus}` : ''}`;
      }

      const io = new IntersectionObserver((es) => es.forEach((e) => { visible = e.isIntersecting; }), { rootMargin: '100px' });
      io.observe(wrap); offs.push(() => io.disconnect());
      return { resize, draw: (dt, t) => visible && draw(dt, t), select, nodes };
    })();

    /* ════════ 4. ACCORDIONS — Therapeutics matrix + FAQ ════════ */
    function accordion(container, onOpen) {
      const rows = [...container.querySelectorAll('.m-row')];
      const set = (row, open) => {
        if (row.classList.contains('is-open') === open) return;
        const body = row.querySelector('.m-body');
        row.classList.toggle('is-open', open);
        row.querySelector('button').setAttribute('aria-expanded', String(open));
        gsap.killTweensOf(body);
        if (open) {
          gsap.to(body, { height: 'auto', duration: 1, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
          gsap.fromTo(body.querySelectorAll('[data-stagger]'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: 'expo.out', delay: 0.1 });
          gsap.fromTo(body.querySelectorAll('.fill[data-on="1"]'), { scaleX: 0 }, { scaleX: 1, stagger: 0.07, duration: 1.1, ease: 'expo.out', delay: 0.25 });
          onOpen && onOpen(row);
        } else {
          gsap.to(body, { height: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => ScrollTrigger.refresh() });
        }
      };
      rows.forEach((row) => {
        on(row.querySelector('button'), 'click', () => {
          const willOpen = !row.classList.contains('is-open');
          rows.forEach((r) => r !== row && set(r, false));
          set(row, willOpen);
        });
        on(row, 'pointermove', (e) => {                                          // cursor-follow light
          const r = row.getBoundingClientRect();
          row.style.setProperty('--mx', `${e.clientX - r.left}px`); row.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
      });
    }
    accordion($('#matrix-rows'), (row) => { const n = Selector.nodes.find((x) => x.id === row.dataset.id); n && Selector.select(n); });
    accordion($('#faq-rows'));

    /* ════════ 5. CURSOR + MAGNETIC ════════ */
    const Cursor = (() => {
      if (!FINE) return { tick() {} };
      document.body.classList.add('custom-cursor');
      const ring = $('.cursor-ring'), dot = $('.cursor-dot');
      let rx = pointer.x, ry = pointer.y;
      on(document, 'pointerover', (e) => { if (e.target.closest('a,button')) document.body.classList.add('c-hover'); });
      on(document, 'pointerout', (e) => { if (e.target.closest('a,button')) document.body.classList.remove('c-hover'); });
      $$('[data-magnetic]').forEach((el) => {
        const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }), qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        on(el, 'pointermove', (e) => { const r = el.getBoundingClientRect(); qx((e.clientX - r.left - r.width / 2) * 0.25); qy((e.clientY - r.top - r.height / 2) * 0.35); });
        on(el, 'pointerleave', () => { qx(0); qy(0); });
      });
      offs.push(() => document.body.classList.remove('custom-cursor', 'c-hover', 'c-drag'));
      return {
        tick() {
          rx += (pointer.x - rx) * 0.16; ry += (pointer.y - ry) * 0.16;
          dot.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
          ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        },
      };
    })();

    on(window, 'pointermove', (e) => {
      pointer.x = e.clientX; pointer.y = e.clientY;
      pointer.nx = (e.clientX / vw) * 2 - 1; pointer.ny = (e.clientY / vh) * 2 - 1;
      pointer.moved = 1.2;
    }, { passive: true });

    /* ════════ 6. SCROLL CHOREOGRAPHY ════════ */
    const manifesto = $('#manifesto');
    if (!manifesto.querySelector('.word')) {
      const text = manifesto.textContent.trim().replace(/\s+/g, ' ');
      manifesto.setAttribute('aria-label', text);
      manifesto.innerHTML = text.split(' ').map((w) => `<span class="word" aria-hidden="true">${w}</span>`).join(' ');
    }
    const words = manifesto.querySelectorAll('.word');
    const counters = $$('[data-count]');

    ctx.add(() => {
      if (!REDUCED) {
        const mm = gsap.matchMedia();
        const build = (start, end) => {
          const span = words.length * 0.12;
          gsap.timeline({ scrollTrigger: { trigger: '#philosophy', start, end, scrub: 0.3 } })
            .to(words, { opacity: 1, stagger: 0.12, ease: 'none', duration: 1 }, 0)
            .fromTo('#ghost', { xPercent: 8 }, { xPercent: -22, ease: 'none', duration: span }, 0)
            .to('#ghost .ghost-fill', { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: span }, 0)
            .fromTo('#kinetic-strip', { xPercent: 0 }, { xPercent: -35, ease: 'none', duration: span }, 0);
        };
        // Desktop: reveal starts while the quote slides in; the last word lands as the pin releases.
        mm.add('(min-width: 768px)', () => build('top 75%', 'bottom bottom'));
        // Phones: no pin — a quick reveal as the quote passes through.
        mm.add('(max-width: 767px)', () => build('top 85%', 'center 45%'));
      }

      $$('section:not(#hero) h2 .line-inner').forEach((el) => {
        gsap.fromTo(el, { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el.closest('h2'), start: 'top 85%' } });
      });
      gsap.to('.reveal-clip', { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.reveal-clip', start: 'top 80%' } });

      counters.forEach((el) => {
        const end = +el.dataset.count, dec = +(el.dataset.decimals || 0), o = { v: 0 };
        el.textContent = dec ? (0).toFixed(dec) : '0';
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () =>
          gsap.to(o, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => { el.textContent = dec ? o.v.toFixed(dec) : Math.round(o.v).toLocaleString(); } }) });
      });

      ['#matrix-rows', '#faq-rows'].forEach((sel) => gsap.fromTo(`${sel} .m-row`, { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: sel, start: 'top 85%' } }));
      $$('#focus-panel, #selector-wrap, #words blockquote, #visit dl, #visit .btn').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });

      const setSkew = $$('#visit h2, #matrix h2').map((el) => gsap.quickTo(el, 'skewY', { duration: 0.8, ease: 'power3.out' }));
      ScrollTrigger.create({ onUpdate: (self) => { const s = gsap.utils.clamp(-2, 2, self.getVelocity() / -500); setSkew.forEach((f) => f(s)); } });
      const unskew = () => setSkew.forEach((f) => f(0));
      ScrollTrigger.addEventListener('scrollEnd', unskew);
      offs.push(() => ScrollTrigger.removeEventListener('scrollEnd', unskew));

      const nav = $('#nav'); let lastY = 0;
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => {
        const y = self.scroll();
        nav.classList.toggle('is-solid', y > vh * 0.6);
        nav.classList.toggle('is-hidden', y > vh && y > lastY + 2);
        if (y < lastY - 2) nav.classList.remove('is-hidden');
        lastY = y;
      } });
    });

    /* testimonials — breathing crossfade */
    (() => {
      const figs = $$('#quotes figure'), dots = $('#quote-dots').children;
      let i = 0;
      const show = (k) => figs.forEach((f, j) => {
        gsap.to(f, { opacity: j === k ? 1 : 0, filter: j === k ? 'blur(0px)' : 'blur(8px)', y: j === k ? 0 : 10, duration: 1.4, ease: 'power2.inOut' });
        f.setAttribute('aria-hidden', String(j !== k)); dots[j].style.background = j === k ? 'rgb(var(--accent))' : '';
      });
      show(0);
      if (!REDUCED) every(() => { if (!document.hidden) show((i = (i + 1) % figs.length)); }, 6500);
    })();

    /* breath cue (synced to the 8s CSS breath) */
    const cue = $('#breath-cue'); let inhale = true;
    if (!REDUCED) every(() => { inhale = !inhale; cue.textContent = inhale ? 'Inhale' : 'Exhale'; }, 4000);

    /* ════════ 7. TRANSITIONS ════════ */
    function veilTo(hash) {
      const target = hash === '#top' ? null : $(hash);
      if (hash !== '#top' && !target) return;
      const y = target ? target.getBoundingClientRect().top + scrollY : 0;
      if (REDUCED) { Smooth.scrollTo(y, true); return; }
      const v = $('#veil');
      Smooth.lock(true);
      gsap.timeline({ onComplete: () => Smooth.lock(false) })
        .set(v, { transformOrigin: 'bottom' })
        .to(v, { scaleY: 1, duration: 0.6, ease: 'expo.in' })
        .add(() => { Smooth.scrollTo(y, true); ScrollTrigger.update(); history.replaceState(null, '', hash); })
        .set(v, { transformOrigin: 'top' })
        .to(v, { scaleY: 0, duration: 0.8, ease: 'expo.out', delay: 0.08 });
    }
    $$('a[data-veil]').forEach((a) => on(a, 'click', (e) => { e.preventDefault(); veilTo(a.getAttribute('href')); }));

    // Deep links from the classic pages (e.g. /#faq, /#contact) land on the right section.
    if (location.hash && location.hash.length > 1) {
      const t = document.getElementById(location.hash.slice(1));
      if (t) requestAnimationFrame(() => Smooth.scrollTo(t.getBoundingClientRect().top + scrollY, true));
    }

    const loader = $('#loader');
    const seen = root.classList.contains('intro-seen');
    ctx.add(() => {
      const heroLines = $$('#hero .line-inner'), fades = $$('.hero-fade');
      if (REDUCED) { loader.style.display = 'none'; if (GL) GL.intro.value = 1; return; }
      gsap.set(heroLines, { yPercent: 115, rotate: 3 }); gsap.set(fades, { opacity: 0, y: 20 });
      const tl = gsap.timeline();
      if (!seen && getComputedStyle(loader).display !== 'none') {
        const count = $('#loader-count'), cueEl = $('#loader-cue'), o = { v: 0 };
        tl.to(o, { v: 100, duration: 1.4, ease: 'power2.inOut', onUpdate: () => { count.textContent = String(Math.round(o.v)).padStart(2, '0'); if (o.v > 55) cueEl.textContent = 'Exhale'; } })
          .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' })
          .add(() => { loader.style.display = 'none'; try { sessionStorage.setItem('gt-intro', '1'); } catch { /* private mode */ } });
      } else {
        loader.style.display = 'none';
      }
      tl.to(GL ? GL.intro : {}, { value: 1, duration: 2.6, ease: 'expo.out' }, seen ? 0 : '-=0.8')
        .to(heroLines, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.12, ease: 'expo.out' }, '-=2.4')
        .to(fades, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' }, '-=1.2');
    });

    /* ════════ 8. SINGLE RAF LOOP ════════ */
    let last = performance.now(), running = true, clock = 0, raf = 0;
    const loop = (now) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
      Smooth.tick();
      pointer.sx += (pointer.x / vw - pointer.sx) * 0.05;
      pointer.sy += (pointer.y / vh - pointer.sy) * 0.05;
      GL && GL.render(clock, dt);
      Selector.draw(dt, clock);
      Cursor.tick();
      raf = requestAnimationFrame(loop);
    };
    on(document, 'visibilitychange', () => {
      if (document.hidden) running = false;
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    });

    let rt;
    const onResize = () => { vw = innerWidth; vh = innerHeight; GL && GL.resize(); Selector.resize(); };
    on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(() => { onResize(); ScrollTrigger.refresh(); }, 120); });

    pushCSS();
    onResize();
    raf = requestAnimationFrame(loop);
    // Fonts change line lengths → re-measure pins once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      running = false; cancelAnimationFrame(raf); clearTimeout(rt);
      offs.forEach((f) => f());
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      GL && GL.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="aura" aria-hidden="true" />
      <canvas id="fiber" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      {/* Entry curtain — shown once per session; hidden without JS */}
      <noscript><style>{'#loader{display:none!important}'}</style></noscript>
      <div id="loader" aria-hidden="true">
        <div className="flex flex-col items-center gap-8">
          <div className="ring" />
          <div className="text-center">
            <div className="display text-3xl tracking-tight">Goodrich <em className="italic">Therapeutics</em></div>
            <div className="eyebrow mt-3"><span id="loader-cue">Inhale</span> · <span id="loader-count" className="num">00</span></div>
          </div>
        </div>
      </div>
      <div id="veil" aria-hidden="true" />

      <div className="cursor cursor-ring" aria-hidden="true"><span>Drag</span></div>
      <div className="cursor cursor-dot" aria-hidden="true" />
    </>
  );
}

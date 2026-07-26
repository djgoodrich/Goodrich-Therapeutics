'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene, camera, renderer, material;
    let animId;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform float uScroll;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x_) - 0.5;
        vec3 ox = floor(x_ + 0.5);
        vec3 a0 = x_ - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x * x0.x  + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 3; ++i) {
          v += a * snoise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        vec2 mouseNorm = uMouse / uResolution.xy;
        float mouseDist = length(gl_FragCoord.xy - uMouse) / max(uResolution.x, uResolution.y);

        vec2 q = vec2(0.0);
        q.x = fbm(st + 0.05 * uTime + uScroll * 0.0005);
        q.y = fbm(st + vec2(1.0));

        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
        r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);

        float f = fbm(st + r + uScroll * 0.0008);

        vec3 c1 = vec3(0.027, 0.027, 0.027); // #070707
        vec3 c2 = vec3(0.039, 0.078, 0.047); // dark sage #0a140c
        vec3 c3 = vec3(0.078, 0.118, 0.086); // sage accent #141e16

        vec3 color = mix(c1, c2, clamp(f * f * 4.0, 0.0, 1.0));
        color = mix(color, c3, clamp(length(q), 0.0, 1.0));

        float mouseInfluence = smoothstep(0.4, 0.0, mouseDist);
        color += vec3(0.03, 0.05, 0.03) * mouseInfluence;

        float distFromCenter = length(gl_FragCoord.xy / uResolution.xy - vec2(0.5));
        color *= (1.0 - distFromCenter * 0.5);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    try {
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uMouse: { value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        },
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const handleResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        material.uniforms.uResolution.value.set(w, h);
      };

      const handleMouseMove = (e) => {
        material.uniforms.uMouse.value.set(e.clientX, window.innerHeight - e.clientY);
      };

      const handleScroll = () => {
        material.uniforms.uScroll.value = window.scrollY;
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll, { passive: true });

      const animate = () => {
        material.uniforms.uTime.value = performance.now() * 0.0005;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    } catch (e) {
      console.warn('WebGL background fallback:', e);
    }
  }, []);

  return <canvas ref={canvasRef} id="webgl-bg" aria-hidden="true" />;
}

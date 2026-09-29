"use client";

import { useEffect, useRef } from "react";
import { lightState } from "@/lib/light-state";

const VERT = "#version 300 es\nin vec2 a_pos;\nvoid main() { gl_Position = vec4(a_pos, 0.0, 1.0); }\n";

const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform vec2 u_light;
uniform float u_time;
uniform float u_intensity;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = uv;
  p.x *= aspect;
  vec2 L = vec2(u_light.x * aspect, u_light.y);

  float breath = 1.0 + 0.05 * sin(u_time * 1.047);
  float I = u_intensity * breath;

  vec2 q = p * 1.5 + vec2(u_time * 0.015, u_time * 0.010);
  float fog = fbm(q);
  fog = fog * 0.7 + 0.3 * fbm(p * 3.0 - u_time * 0.02);

  vec2 dir = L - p;
  float dist = length(dir);
  dir /= max(dist, 0.0001);
  float rays = 0.0;
  vec2 sp = p;
  for (int i = 0; i < 18; i++) {
    sp += dir * dist * 0.035;
    rays += fbm(sp * 2.6 + u_time * 0.04);
  }
  rays /= 18.0;
  rays *= exp(-dist * 1.15);

  float dL = distance(p, L);
  float hot = exp(-dL * dL * 22.0);
  float wide = exp(-dL * 3.2);

  vec2 poolP = vec2((p.x - L.x) / (aspect * 0.55), (p.y - 0.22) / 0.30);
  float pool = exp(-dot(poolP, poolP) * 2.2);

  float horizonPhase = u_time * 0.15;
  float horizonY = 0.30
    + sin(p.x * 0.8 + horizonPhase) * 0.006
    + sin(u_time * 0.03) * 0.004;
  float horizon = exp(-pow((p.y - horizonY) / 0.006, 2.0));

  vec3 coolFog = vec3(0.14, 0.20, 0.32) * 0.22;
  vec3 warm = vec3(1.0, 0.72, 0.35);
  vec3 horizonCool = vec3(0.20, 0.32, 0.48) * 0.05;

  vec3 col = coolFog;
  col += warm * rays * 0.75 * I;
  col += warm * wide * 0.22 * I;
  col += vec3(1.0, 0.90, 0.72) * hot * 0.35 * I;
  col += warm * pool * 0.06 * I;
  col += horizonCool * horizon;
  col *= 0.55 + fog * 0.55;

  float v = smoothstep(1.35, 0.15, length(p - vec2(aspect * 0.5, 0.5)));
  col *= v;

  fragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function HeroFog() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const wide = window.innerWidth >= 1024;
    const saveData = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection?.saveData;

    // Hard no — the shader is not built at all on these paths.
    if (!wide || saveData) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uLight = gl.getUniformLocation(prog, "u_light");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uIntensity = gl.getUniformLocation(prog, "u_intensity");

    // H8: tighten the DPR cap slightly so the static frame matches the live frame.
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let scale = 0.6;

    const resize = () => {
      const w = Math.floor(window.innerWidth * scale * DPR);
      const h = Math.floor(window.innerHeight * scale * DPR);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
      }
    };
    resize();

    // ── static frame path (reduced motion or coarse pointer) ──
    const renderStaticFrame = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uLight, 0.5, 0.42);
      gl.uniform1f(uTime, 12.5); // fixed time → deterministic fog shape
      gl.uniform1f(uIntensity, 0.85);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduce || coarse) {
      renderStaticFrame();
      const onResizeStatic = () => { resize(); renderStaticFrame(); };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    // ── live path ──
    let rafId = 0;
    let lastT = performance.now();
    window.addEventListener("resize", resize);

    const frameTimes: number[] = [];
    let degraded = 0;

    let running = true;
    const onVis = () => { running = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const draw = (t: number) => {
      const dt = t - lastT;
      lastT = t;
      rafId = requestAnimationFrame(draw);
      if (!running) return;

      frameTimes.push(dt);
      if (frameTimes.length > 30) {
        const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        frameTimes.length = 0;
        // H8: tightened 24ms → 20ms.
        if (avg > 20) {
          if (degraded === 0) { degraded = 1; scale = 0.4; resize(); }
          else if (degraded === 1) { degraded = 2; }
        }
      }
      if (degraded === 2) {
        cancelAnimationFrame(rafId);
        canvas.style.opacity = "0";
        return;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uLight, lightState.x, 1 - lightState.y);
      gl.uniform1f(uTime, t / 1000);
      gl.uniform1f(uIntensity, lightState.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas id="hero-fog" ref={ref} aria-hidden="true" />;
}

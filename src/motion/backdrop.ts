import { motionOn, onMotionChange } from './prefs';

/**
 * Two canvas layers behind the page.
 *
 * The particle field is 2D: drifting nodes that link to their neighbours and
 * to the pointer — the "neural network" look, kept faint enough to read as
 * paper texture. The aurora is a single WebGL fragment shader, written by
 * hand rather than pulled in with Three.js, because one full-screen quad
 * does not justify a 600 kB dependency on a page whose whole build is
 * currently library-free.
 *
 * Both stop when the tab is hidden, when the page is scrolled past them, and
 * when motion is switched off. Both fail silently: no canvas, no context,
 * no problem — the page has five other background layers in CSS.
 */

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

const readAccent = (): [number, number, number] => {
  const raw = getComputedStyle(document.body).getPropertyValue('--accent').trim();
  const hex = raw.replace('#', '');
  if (hex.length !== 6) return [0.88, 0.35, 0.2];
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ];
};

/* ─────────────────────────────────────────────── particle field ── */

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export function initParticles(): void {
  const canvas = document.getElementById('bg-particles') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let nodes: Node[] = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let frame = 0;
  let visible = true;
  const pointer = { x: -999, y: -999 };

  const size = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // density by area, capped so a 4K monitor doesn't get 400 nodes
    const count = clamp(Math.round((w * h) / 22000), 18, 70);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.3 + 0.6
    }));
  };

  const draw = () => {
    frame = 0;
    ctx.clearRect(0, 0, w, h);

    const style = getComputedStyle(document.body);
    const line = style.getPropertyValue('--border').trim() || '#322c24';
    const dot = style.getPropertyValue('--muted').trim() || '#a79d8d';
    const accent = style.getPropertyValue('--accent').trim() || '#e05a33';

    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) node.x = w + 20;
      if (node.x > w + 20) node.x = -20;
      if (node.y < -20) node.y = h + 20;
      if (node.y > h + 20) node.y = -20;
    });

    // neighbour links — O(n²) over at most 70 nodes, which is nothing
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d > 130) continue;

        ctx.globalAlpha = (1 - d / 130) * 0.32;
        ctx.strokeStyle = line;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }

    // and the pointer joins the graph
    nodes.forEach(node => {
      const d = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      if (d < 170) {
        ctx.globalAlpha = (1 - d / 170) * 0.5;
        ctx.strokeStyle = accent;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }

      ctx.globalAlpha = d < 170 ? 0.7 : 0.4;
      ctx.fillStyle = d < 170 ? accent : dot;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (visible && motionOn()) frame = requestAnimationFrame(draw);
  };

  const start = () => {
    if (frame || !motionOn() || !visible) return;
    frame = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    ctx.clearRect(0, 0, w, h);
  };

  size();
  start();

  window.addEventListener('resize', () => { size(); if (!frame) start(); }, { passive: true });

  document.addEventListener('pointermove', event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  document.addEventListener('pointerleave', () => { pointer.x = -999; pointer.y = -999; });

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) start(); else stop();
  });

  onMotionChange(on => (on ? start() : stop()));
}

/* ────────────────────────────────────────────────── WebGL aurora ── */

const VERT = `
attribute vec2 pos;
void main() { gl_Position = vec4(pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  res;
uniform float time;
uniform vec3  accent;
uniform vec3  deep;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / res;
  vec2 q = uv;
  q.x *= res.x / res.y;

  float t = time * 0.035;

  // two noise fields sliding past each other make the bands fold
  float n1 = fbm(q * 2.2 + vec2(t, t * 0.55));
  float n2 = fbm(q * 3.4 - vec2(t * 0.7, t * 0.3) + n1);

  float band = smoothstep(0.34, 0.86, n1 * 0.65 + n2 * 0.45);

  // fade out towards the bottom so the curtain hangs from the top
  band *= smoothstep(0.05, 0.75, 1.0 - uv.y);

  vec3 col = mix(deep, accent, clamp(n2, 0.0, 1.0));
  gl_FragColor = vec4(col, pow(band, 1.8));
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export function initAurora(): void {
  const canvas = document.getElementById('bg-webgl') as HTMLCanvasElement | null;
  if (!canvas) return;

  const gl = (canvas.getContext('webgl', { alpha: true, antialias: false, depth: false }) ??
    canvas.getContext('experimental-webgl', { alpha: true })) as WebGLRenderingContext | null;
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  gl.useProgram(program);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const pos = gl.getAttribLocation(program, 'pos');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'res');
  const uTime = gl.getUniformLocation(program, 'time');
  const uAccent = gl.getUniformLocation(program, 'accent');
  const uDeep = gl.getUniformLocation(program, 'deep');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let frame = 0;
  let visible = true;
  let lost = false;
  let last = 0;
  let clock = 0;

  const size = () => {
    // half resolution: the shader is all low-frequency noise, nobody can
    // tell, and it costs a quarter of the fill rate
    const dpr = Math.min(window.devicePixelRatio || 1, 1) * 0.5;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;

    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  const draw = (now: number) => {
    frame = 0;
    if (lost) return;

    // 30fps is plenty for something this slow, and halves the GPU cost
    const dt = last ? now - last : 16;
    if (dt < 32) {
      frame = requestAnimationFrame(draw);
      return;
    }

    last = now;
    clock += dt / 1000;

    size();

    const accent = readAccent();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, clock);
    gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);
    gl.uniform3f(uDeep, accent[0] * 0.35, accent[1] * 0.3, accent[2] * 0.55);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (visible && motionOn()) frame = requestAnimationFrame(draw);
  };

  const start = () => {
    if (frame || lost || !motionOn() || !visible) return;
    last = 0;
    canvas.classList.add('live');
    frame = requestAnimationFrame(draw);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    canvas.classList.remove('live');
  };

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    stop();
  });

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) start(); else stop();
  });

  onMotionChange(on => (on ? start() : stop()));
  window.addEventListener('resize', size, { passive: true });

  start();
}

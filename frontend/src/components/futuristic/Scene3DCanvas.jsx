import React, { useRef, useEffect, useState } from 'react';
import { playClick } from '../../utils/cyberAudio';

const Scene3DCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse & interaction state refs for zero-overhead animation loop
  const stateRef = useRef({
    rotX: 0.2,
    rotY: 0,
    targetRotX: 0.2,
    targetRotY: 0,
    velX: 0,
    velY: 0.004,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    mode: 'GLOBAL',
    particles: [],
    globeNodes: [],
    rings: [],
  });



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let lastTime = performance.now();

    // Resize handler
    const handleResize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize 3D Geodesic Nodes (Fibonacci sphere distribution)
    const nodeCount = 54;
    const globeNodes = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < nodeCount; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const r = 175; // base radius
      globeNodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        baseX: r * Math.sin(phi) * Math.cos(theta),
        baseY: r * Math.sin(phi) * Math.sin(theta),
        baseZ: r * Math.cos(phi),
        size: Math.random() > 0.8 ? 4.2 : 2.5,
        isHub: i % 7 === 0,
        pulseOffset: Math.random() * Math.PI * 2,
        color: i % 7 === 0 ? '#D4AF37' : i % 3 === 0 ? '#881337' : '#EA580C',
      });
    }
    stateRef.current.globeNodes = globeNodes;

    // Initialize Floating Deep Particles
    const particleCount = 75;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 2.2 + 1,
        speed: (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.7 + 0.2,
      });
    }
    stateRef.current.particles = particles;

    // 3D Matrix Math Projection
    const focalLength = 480;

    const project = (x, y, z, cx, cy) => {
      const scale = focalLength / (focalLength + z);
      return {
        px: cx + x * scale,
        py: cy + y * scale,
        scale,
        visible: z > -focalLength + 20,
      };
    };

    // Main Render Loop
    const render = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const state = stateRef.current;
      const cx = canvas.width / (2 * (window.devicePixelRatio || 1));
      const cy = canvas.height / (2 * (window.devicePixelRatio || 1));

      // Inertial spin update
      if (!state.isDragging) {
        state.rotY += state.velY;
        state.rotX += (state.targetRotX - state.rotX) * 0.05;
      }

      const cosX = Math.cos(state.rotX);
      const sinX = Math.sin(state.rotX);
      const cosY = Math.cos(state.rotY);
      const sinY = Math.sin(state.rotY);

      // Rotate point in 3D (around Y then X)
      const rotate3D = (p) => {
        // around Y
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        // around X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        return { x: x1, y: y2, z: z2 };
      };

      // 1. Ambient Background Golden Particles
      state.particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > 350) p.y = -350;
        if (p.y < -350) p.y = 350;

        const rotated = rotate3D(p);
        const proj = project(rotated.x, rotated.y, rotated.z, cx, cy);

        if (proj.visible) {
          const alpha = p.opacity * Math.min(1, Math.max(0.1, (rotated.z + 400) / 600));
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217, 119, 6, ${alpha * 0.45})`;
          ctx.fill();
        }
      });

      // 2. Orbital Energy Rings
      const ringCount = state.mode === 'CORE' ? 3 : 2;
      for (let rIdx = 0; rIdx < ringCount; rIdx++) {
        const ringRadius = 185 + rIdx * 35;
        const segments = 48;
        const ringTiltX = 0.85 + rIdx * 0.45;
        const ringTiltZ = rIdx * 0.6;
        const ringSpeed = (rIdx % 2 === 0 ? 1 : -1) * (now * 0.001);

        ctx.beginPath();
        let first = true;
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2 + ringSpeed;
          let rx = Math.cos(angle) * ringRadius;
          let ry = Math.sin(angle) * (ringRadius * 0.38);
          let rz = Math.sin(angle) * (ringRadius * 0.2);

          // Apply ring tilt
          const ty = ry * Math.cos(ringTiltX) - rz * Math.sin(ringTiltX);
          const tz = ry * Math.sin(ringTiltX) + rz * Math.cos(ringTiltX);

          const rot = rotate3D({ x: rx, y: ty, z: tz });
          const proj = project(rot.x, rot.y, rot.z, cx, cy);

          if (proj.visible) {
            if (first) {
              ctx.moveTo(proj.px, proj.py);
              first = false;
            } else {
              ctx.lineTo(proj.px, proj.py);
            }
          }
        }
        ctx.strokeStyle =
          rIdx === 0
            ? 'rgba(212, 175, 55, 0.45)'
            : 'rgba(194, 65, 12, 0.35)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Photonic pulse moving on ring
        const pulseAngle = (now * 0.002 * (rIdx === 0 ? 1 : -1.2)) % (Math.PI * 2);
        const px = Math.cos(pulseAngle) * ringRadius;
        const py = Math.sin(pulseAngle) * (ringRadius * 0.38);
        const pz = Math.sin(pulseAngle) * (ringRadius * 0.2);
        const pty = py * Math.cos(ringTiltX) - pz * Math.sin(ringTiltX);
        const ptz = py * Math.sin(ringTiltX) + pz * Math.cos(ringTiltX);
        const pRot = rotate3D({ x: px, y: pty, z: ptz });
        const pProj = project(pRot.x, pRot.y, pRot.z, cx, cy);

        if (pProj.visible) {
          ctx.beginPath();
          ctx.arc(pProj.px, pProj.py, 4.5 * pProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#D4AF37';
          ctx.shadowColor = '#F59E0B';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      }

      // 3. 3D Globe Projected Coordinates
      const projectedNodes = state.globeNodes.map((node) => {
        // Mode transforms
        let rScale = 1;
        if (state.mode === 'NEURAL') {
          rScale = 1.25 + Math.sin(now * 0.002 + node.pulseOffset) * 0.15;
        } else if (state.mode === 'CORE') {
          rScale = 0.85;
        }

        const rotated = rotate3D({
          x: node.baseX * rScale,
          y: node.baseY * rScale,
          z: node.baseZ * rScale,
        });
        const proj = project(rotated.x, rotated.y, rotated.z, cx, cy);
        return { ...node, ...proj, rotatedZ: rotated.z };
      });

      // 4. Draw Interconnecting Synaptic Dispatch Lines (Globe Wireframe Arcs)
      const maxDistance = state.mode === 'NEURAL' ? 100 : 85;
      for (let i = 0; i < projectedNodes.length; i++) {
        const n1 = projectedNodes[i];
        if (!n1.visible) continue;

        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n2 = projectedNodes[j];
          if (!n2.visible) continue;

          // Compute 2D or 3D Euclidean distance
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35 * Math.min(n1.scale, n2.scale);
            ctx.beginPath();
            ctx.moveTo(n1.px, n1.py);
            ctx.lineTo(n2.px, n2.py);
            ctx.strokeStyle =
              n1.isHub || n2.isHub
                ? `rgba(212, 175, 55, ${alpha * 1.8})`
                : `rgba(194, 65, 12, ${alpha * 1.3})`;
            ctx.lineWidth = n1.isHub || n2.isHub ? 1.5 : 1;
            ctx.stroke();
          }
        }
      }

      // 5. Draw 3D Dispatch Nodes (sort by Z for correct depth buffering)
      projectedNodes.sort((a, b) => a.rotatedZ - b.rotatedZ);

      projectedNodes.forEach((node) => {
        if (!node.visible) return;

        const pulse = Math.sin(now * 0.004 + node.pulseOffset) * 0.4 + 1;
        const radius = node.size * node.scale * pulse;

        // Node Glow Halo for Hubs
        if (node.isHub) {
          ctx.beginPath();
          ctx.arc(node.px, node.py, radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(node.px, node.py, radius * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isHub ? 12 : 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6. Central Holographic Core / Energy Sphere
      const corePulse = Math.sin(now * 0.003) * 8;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140 + corePulse);
      coreGrad.addColorStop(0, 'rgba(217, 119, 6, 0.08)');
      coreGrad.addColorStop(0.5, 'rgba(194, 65, 12, 0.04)');
      coreGrad.addColorStop(1, 'rgba(250, 248, 245, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 140 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse drag & interaction handlers
  const handleMouseDown = (e) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
    playClick();
  };

  const handleMouseMove = (e) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.lastMouseX;
    const dy = e.clientY - stateRef.current.lastMouseY;

    stateRef.current.targetRotY += dx * 0.006;
    stateRef.current.targetRotX += dy * 0.006;
    stateRef.current.rotY += dx * 0.006;
    stateRef.current.rotX += dy * 0.006;

    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  return (
    <div
      className={`relative w-full h-full select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUp();
      }}
    >
      {/* 3D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Scene3DCanvas;

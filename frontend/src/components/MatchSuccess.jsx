import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

export default function MatchSuccess({ matchData, myProfile, onOpenChat, onClose }) {
  const threeContainerRef = useRef(null);
  const shaderCanvasRef = useRef(null);

  // Setup Three.js Heart Animation
  useEffect(() => {
    const container = threeContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Heart Geometry
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
    heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
    heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
    heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

    const geometry = new THREE.ExtrudeGeometry(heartShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1
    });

    const material = new THREE.MeshPhongMaterial({
      color: 0x007fff,
      shininess: 100,
      specular: 0xffffff,
      transparent: true,
      opacity: 0.9
    });

    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(1.5, -1.5, 1.5); // Flip and scale
    scene.add(heart);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      heart.rotation.y += 0.01;
      heart.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
      heart.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // Setup WebGL Shader Animation
  useEffect(() => {
    const canvas = shaderCanvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;
    
    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    
    // Gradient base: Luminous Azure colors
    vec3 color1 = vec3(0.0, 0.5, 1.0); // Azure
    vec3 color2 = vec3(0.7, 0.9, 1.0); // Sky Blue
    vec3 color3 = vec3(0.9, 0.95, 1.0); // Silver/White
    
    float t = u_time * 0.5;
    
    // Wave motion
    float wave = sin(p.x * 2.0 + t) * 0.5 + sin(p.y * 1.5 + t * 1.2) * 0.5;
    vec3 finalColor = mix(color1, color2, uv.y + wave * 0.1);
    finalColor = mix(finalColor, color3, clamp(sin(t + length(p) * 2.0), 0.0, 1.0) * 0.2);
    
    // Particle-like glints
    float glint = pow(noise(uv + t * 0.01), 20.0);
    finalColor += glint * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    
    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    
    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-surface"
    >
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(192, 192, 192, 0.2);
        }
        .avatar-glow {
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(227, 242, 253, 0.4);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 1);
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full opacity-60">
          <div ref={threeContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>

      {/* 3D Heart Scene (Centerpiece) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-96 z-10 pointer-events-none">
        <div className="w-full h-full">
          <canvas ref={shaderCanvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-lg mt-16 px-4">
        {/* Headline & Sub-headline */}
        <motion.div 
          initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4 text-glow leading-tight">
            It's a Spark!
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-xs mx-auto">
            You and {matchData.otherProfile.name || 'someone'} have found a meaningful connection.
          </p>
        </motion.div>

        {/* Avatars Section */}
        <div className="relative flex items-center justify-center gap-12 md:gap-24 my-8 w-full">
          {/* User Avatar */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white avatar-glow overflow-hidden animate-float"
          >
            <img 
              alt="Your Profile" 
              className="w-full h-full object-cover" 
              src={myProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
            />
          </motion.div>

          {/* Other User Avatar */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white avatar-glow overflow-hidden animate-float" 
            style={{ animationDelay: '0.5s' }}
          >
            <img 
              alt={`${matchData.otherProfile.name}'s Profile`} 
              className="w-full h-full object-cover" 
              src={matchData.otherProfile.photos?.[0]?.url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"}
            />
          </motion.div>

          {/* Connection Sparkle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-tertiary blur-sm scale-[10] opacity-20"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 w-full max-w-xs mt-8"
        >
          <button 
            onClick={() => onOpenChat(matchData.matchId, matchData.otherProfile)}
            className="w-full py-4 px-8 bg-gradient-to-r from-primary to-primary-container text-white font-semibold text-lg rounded-full shadow-lg hover:opacity-90 transition-all scale-100 active:scale-95 active:duration-150 glass-panel border-none"
          >
            Send a Message
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 px-8 bg-transparent text-primary font-semibold text-lg rounded-full border-2 border-outline-variant hover:bg-surface-container-low transition-all scale-100 active:scale-95 active:duration-150"
          >
            Keep Discovering
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

import React, { useEffect, useRef } from 'react';

interface StarFieldProps {
  density?: number; // stars per 1000 pixels squared
  speed?: number; // pixels per second
  depth?: number; // layers of stars
  className?: string;
}

const StarField: React.FC<StarFieldProps> = ({ 
  density = 0.5, 
  speed = 0.5, 
  depth = 3,
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Array<{x: number, y: number, size: number, brightness: number, speed: number}>>([]);
  const animationRef = useRef<number>(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Generate stars based on canvas size and density
      const area = canvas.width * canvas.height;
      const starCount = Math.floor(area * density / 1000);
      
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          brightness: Math.random() * 0.8 + 0.2,
          speed: (Math.random() * 0.5 + 0.5) * speed
        });
      }
    };
    
    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    let lastTime = 0;
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and move stars
      starsRef.current.forEach(star => {
        const movement = (star.speed * delta) / 16; // Convert to pixels per frame
        
        // Move star downward
        star.y += movement;
        
        // Wrap around if star goes off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        
        // Draw star
        ctx.beginPath();
        // Use different colors for stars based on brightness
        const hue = 220 + star.brightness * 40; // Blueish-white
        const saturation = 30 - star.brightness * 30; // Less saturation for brighter stars
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${50 + star.brightness * 50}%, ${star.brightness})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw subtle nebula-like clouds
      const drawNebula = () => {
        const time = Date.now() / 10000;
        
        for (let i = 0; i < 3; i++) { // Draw 3 nebulae
          const xOffset = Math.sin(time + i) * (canvas.width * 0.1);
          const yOffset = Math.cos(time + i * 2) * (canvas.height * 0.1);
          
          const gradient = ctx.createRadialGradient(
            canvas.width * (0.3 + i * 0.2) + xOffset,
            canvas.height * (0.3 + i * 0.3) + yOffset,
            0,
            canvas.width * (0.3 + i * 0.2) + xOffset,
            canvas.height * (0.3 + i * 0.3) + yOffset,
            canvas.width * 0.3
          );
          
          // Different colors for different nebulae
          let color;
          if (i === 0) color = [20, 0, 50]; // Purple
          else if (i === 1) color = [0, 20, 50]; // Blue
          else color = [50, 20, 20]; // Red
          
          gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.05)`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
        }
      };
      
      drawNebula();
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [density, speed, depth]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      style={{ background: 'linear-gradient(to bottom, #000000, #050520)' }}
    />
  );
};

export default StarField;
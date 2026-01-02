import React, { useEffect, useRef } from 'react';

export default function LiveChart({ symbol }) {
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    let raf;
    let x = 0;
    function draw() {
      if (!ctx) return;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(x % ctx.canvas.width, Math.random() * ctx.canvas.height, 2, 2);
      x += 2;
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [symbol]);

  return <canvas ref={canvasRef} width={600} height={200} className="w-full" />;
}

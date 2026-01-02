import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import '@/styles/hero.css';

gsap.registerPlugin(CustomEase, MotionPathPlugin);

export default function AnimatedHero() {
  const svgRef = useRef(null);
  const tlRef = useRef([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ellipses = Array.from(svg.querySelectorAll('.ell'));

    // custom eases
    const easeA = CustomEase.create('customA', 'M0,0 C0.2,0 0.432,0.147 0.507,0.374 0.59,0.629 0.822,1 1,1');
    const easeB = CustomEase.create('customB', 'M0,0 C0.266,0.412 0.297,0.582 0.453,0.775 0.53,0.87 0.78,1 1,1');
    const easeC = CustomEase.create('customC', 'M0,0 C0.594,0.062 0.79,0.698 1,1');

    const colorInterp = gsap.utils.interpolate(['#359EEE', '#FFC43D', '#EF476F', '#03CEA4']);

    // show svg
    gsap.set(svg, { visibility: 'visible' });

    // animate ellipses with staggered timelines
    ellipses.forEach((el, i) => {
      const a = i + 1;
      const tl = gsap.timeline({ defaults: { ease: easeC }, repeat: -1 });
      // set initial stroke opacity and color
      gsap.set(el, { opacity: 1 - a / ellipses.length, stroke: colorInterp(a / ellipses.length) });
      tl.to(el, { attr: { ry: `-=${a * 2.3}`, rx: `+=${a * 1.4}` }, ease: easeB, duration: 1 + (i % 3) * 0.15 })
        .to(el, { attr: { ry: `+=${a * 2.3}`, rx: `-=${a * 1.4}` }, ease: easeA, duration: 1 + (i % 3) * 0.15 })
        .to(el, { duration: 1, rotation: -180, transformOrigin: '50% 50%' }, 0)
        .timeScale(0.5);
      tlRef.current.push(tl);
    });

    // gradient & ai scale pulse
    const gradTl = gsap.timeline({ repeat: -1 });
    gradTl.to('#aiGrad', { duration: 4, delay: 0.75, attr: { x1: '+=-300', x2: '+=-300' }, repeat: -1, ease: 'none' });
    const aiTl = gsap.to('#ai', { duration: 1, scale: 1.1, transformOrigin: '50% 50%', repeat: -1, yoyo: true, ease: easeC });
    tlRef.current.push(gradTl, aiTl);

    return () => {
      // cleanup timelines
      tlRef.current.forEach((t) => {
        try {
          t.kill();
        } catch (e) {
          /* ignore cleanup errors */
        }
      });
      tlRef.current = [];
    };
  }, []);

  return (
    <div className="hero-wrapper">
      <svg id="mainSVG" ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="aiGrad" x1="513.98" y1="290" x2="479.72" y2="320" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset=".15" stopColor="#EF476F" />
            <stop offset=".4" stopColor="#359eee" />
            <stop offset=".6" stopColor="#03cea4" />
            <stop offset=".78" stopColor="#FFC43D" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* many ellipses */}
        {Array.from({ length: 32 }).map((_, i) => (
          <ellipse key={i} className="ell" cx="400" cy="300" rx="80" ry="80" />
        ))}

        <path id="ai" opacity={0} d="m417.17,323.85h-34.34c-3.69,0-6.67-2.99-6.67-6.67v-34.34c0-3.69,2.99-6.67,6.67-6.67h34.34c3.69,0,6.67,2.99,6.67,6.67v34.34c0,3.69-2.99,6.67-6.67,6.67Zm-5.25-12.92v-21.85c0-.55-.45-1-1-1h-21.85c-.55,0-1,.45-1,1v21.85c0,.55.45,1,1,1h21.85c.55,0,1-.45,1-1Zm23.08-16.29h-11.15m-47.69,0h-11.15m70,10.73h-11.15m-47.69,0h-11.15m40.37,29.63v-11.15m0-47.69v-11.15m-10.73,70v-11.15m0-47.69v-11.15" stroke="url(#aiGrad)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" />
      </svg>
    </div>
  );
}

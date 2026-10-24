'use client';
import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { to: 500, suffix: '+', label: 'Students Placed' },
  { to: 156, suffix: '+', label: 'Partner Universities' },
  { to: 15, suffix: '+', label: 'Countries' },
  { to: 98, suffix: '%', label: 'Success Rate' },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(to); // final value first, so search engines and no-JS visitors see the real number

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-white mb-2 tabular-nums">
      {n}{suffix}
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Counter to={stat.to} suffix={stat.suffix} />
              <div className="text-indigo-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';

interface CounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  padZero?: boolean;
  className?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  padZero = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        setDisplayValue(Math.round(latest));
      },
      onComplete() {
        setDisplayValue(value);
      },
    });

    return () => controls.stop();
  }, [isInView, value, duration]);

  const formatted = padZero && displayValue < 10 ? `0${displayValue}` : `${displayValue}`;

  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
export default Counter;

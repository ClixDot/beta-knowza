import React, { useState } from 'react';
import type { ActivityRecord } from '../../cms/types';

const DAY_MS = 86400000;

/** Edits per day for the last seven days, counted from the real activity log. */
export function activityByDay(activity: ActivityRecord[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const start = new Date(today.getTime() - (6 - i) * DAY_MS);
    const end = start.getTime() + DAY_MS;
    return {
      key: start.toISOString(),
      label: start.toLocaleDateString(undefined, { weekday: 'short' }),
      full: start.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }),
      count: activity.filter((a) => {
        const at = new Date(a.createdAt).getTime();
        return at >= start.getTime() && at < end;
      }).length,
    };
  });
}

export const ActivityBars: React.FC<{ activity: ActivityRecord[] }> = ({ activity }) => {
  const days = activityByDay(activity);
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="relative">
      <p className="flex items-baseline gap-2 mb-3">
        <span className="adm-display text-[34px] leading-none text-adm-ink">{total}</span>
        <span className="text-[12px] leading-tight text-adm-mute">{total === 1 ? 'change' : 'changes'} in the last 7 days</span>
      </p>
      <div className="flex items-end gap-1 h-36" aria-hidden="true">
        {days.map((day, index) => {
          const isToday = index === days.length - 1;
          const height = `${Math.max(14, (day.count / max) * 86)}%`;
          return (
            <div
              key={day.key}
              className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-1.5 relative"
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
            >
              {hover === index && (
                <div className={`absolute z-10 bottom-[calc(100%-18px)] whitespace-nowrap rounded-[10px] bg-adm-deeper text-white text-[11.5px] px-2.5 py-1.5 shadow-lg pointer-events-none ${index < 2 ? 'left-0' : index > 4 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                  {day.full}: {day.count} {day.count === 1 ? 'change' : 'changes'}
                </div>
              )}
              <div className="relative w-full flex-1 flex items-end justify-center">
                {day.count === 0 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-adm-deep/25 mb-0.5" />
                ) : (
                  <div
                    className="adm-rise relative flex justify-center"
                    style={{ height, animationDelay: `${index * 45}ms` }}
                  >
                    <span className={`block h-full rounded-full ${isToday ? 'w-3 bg-[#5F6C36]' : 'w-[5px] bg-adm-deep'}`} />
                    <span className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full ${isToday ? 'hidden' : 'bg-adm-deep'}`} />
                  </div>
                )}
              </div>
              <span className={`text-[11.5px] ${isToday ? 'text-adm-ink font-semibold' : 'text-adm-mute'}`}>{day.label.slice(0, 1)}</span>
            </div>
          );
        })}
      </div>
      <table className="sr-only">
        <caption>Changes per day over the last seven days</caption>
        <tbody>
          {days.map((day) => (
            <tr key={day.key}>
              <th scope="row">{day.full}</th>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export const StatusDonut: React.FC<{ segments: DonutSegment[]; centerLabel: string }> = ({ segments, centerLabel }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const [hover, setHover] = useState<number | null>(null);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  // The 2 unit gap keeps neighbouring segments visibly separate.
  const gap = segments.filter((s) => s.value > 0).length > 1 ? 2 : 0;
  let offset = 0;
  const primaryShare = total ? Math.round((segments[0].value / total) * 100) : 0;
  const active = hover !== null ? segments[hover] : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(40, 53, 31, 0.1)" strokeWidth="8" />
          {segments.map((segment, index) => {
            const length = total ? (segment.value / total) * circumference : 0;
            const dash = Math.max(0, length - gap);
            const element = (
              <circle
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={hover === index ? 11 : 8}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                style={{ transition: 'stroke-width 120ms ease' }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(null)}
              />
            );
            offset += length;
            return element;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="adm-display text-[34px] leading-none text-adm-ink">{active ? active.value : `${primaryShare}%`}</span>
          <span className="text-[12px] text-adm-mute mt-1 max-w-[84px]">{active ? active.label : centerLabel}</span>
        </div>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-1.5 text-[12px] text-adm-ink">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} aria-hidden="true" />
            {segment.label} <span className="text-adm-mute">{segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

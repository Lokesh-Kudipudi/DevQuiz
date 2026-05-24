import { useEffect, useMemo, useState } from 'react';
import axios from '../../api/axios';

const WEEKS_TO_SHOW = 34;
const DAYS = WEEKS_TO_SHOW * 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (date) => date.toISOString().slice(0, 10);
const MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' });

const intensityClass = (count) => {
  if (!count) return 'bg-[var(--color-surface2)]';
  if (count <= 2) return 'bg-green-900/70';
  if (count <= 4) return 'bg-green-700/80';
  return 'bg-green-500/90';
};

const StreakCard = () => {
  const [dailyCounts, setDailyCounts] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data } = await axios.get('/api/solo/streak');
        setDailyCounts(data.dailyCounts || []);
        setCurrentStreak(data.currentStreak || 0);
      } catch (err) {
        console.error('Failed to fetch streak', err);
      }
    };

    fetchStreak();
  }, []);

  const renderColumns = useMemo(() => {
    const counts = new Map(dailyCounts.map((entry) => [entry.date, entry.count]));

    const end = new Date();
    end.setUTCHours(0, 0, 0, 0);
    const start = new Date(end.getTime() - (DAYS - 1) * DAY_MS);

    const weeks = [];
    for (let weekIndex = 0; weekIndex < WEEKS_TO_SHOW; weekIndex += 1) {
      const weekStart = new Date(start.getTime() + weekIndex * 7 * DAY_MS);
      const monthKey = weekStart.toISOString().slice(0, 7);
      const days = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const day = new Date(weekStart.getTime() + dayIndex * DAY_MS);
        const key = toDateKey(day);
        days.push({ key, count: counts.get(key) || 0 });
      }

      weeks.push({
        type: 'week',
        key: `week-${weekStart.toISOString()}`,
        monthKey,
        monthLabel: MONTH_FORMATTER.format(weekStart),
        days,
      });
    }

    const columns = [];
    let lastMonthKey = '';

    weeks.forEach((week, index) => {
      const showMonthLabel = week.monthKey !== lastMonthKey;
      if (showMonthLabel) {
        lastMonthKey = week.monthKey;
      }

      columns.push({
        ...week,
        showMonthLabel,
      });

      const next = weeks[index + 1];
      if (next && next.monthKey !== week.monthKey) {
        columns.push({
          type: 'spacer',
          key: `spacer-${week.monthKey}`,
        });
      }
    });

    return columns;
  }, [dailyCounts]);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-text-base)]/[0.07] rounded-[12px] p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-['Syne',sans-serif] font-bold text-base text-[var(--color-text-base)]">
          Practice Streak
        </h2>
        <div className="text-right">
          <p className="text-xl font-bold text-[var(--color-accent)] leading-none">{currentStreak}</p>
          <p className="text-[10px] uppercase tracking-[1.2px] text-[var(--color-muted)] font-mono">days</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid grid-rows-1 grid-flow-col auto-cols-max gap-0.5 mb-1">
          {renderColumns.map((item) => {
            if (item.type === 'spacer') {
              return <div key={item.key} className="w-2" aria-hidden="true" />;
            }

            return (
              <div
                key={`label-${item.key}`}
                className="w-7 text-[9px] uppercase tracking-[1px] text-[var(--color-muted)] font-mono"
              >
                {item.showMonthLabel ? item.monthLabel : ''}
              </div>
            );
          })}
        </div>

        <div className="inline-grid grid-rows-7 grid-flow-col auto-cols-max gap-0.5">
          {renderColumns.map((item) => {
            if (item.type === 'spacer') {
              return <div key={item.key} className="row-span-7 w-2" aria-hidden="true" />;
            }

            return item.days.map((day) => (
              <div
                key={day.key}
                title={`${day.key}: ${day.count} activities`}
                className={`w-7 h-7 rounded-[2px] border border-[var(--color-text-base)]/[0.05] ${intensityClass(day.count)}`}
              />
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;

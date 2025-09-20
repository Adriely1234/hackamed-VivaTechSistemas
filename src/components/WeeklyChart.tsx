import React from 'react';
import { WeeklyAttendance } from '../services/ReportService';

interface WeeklyChartProps {
  data: WeeklyAttendance[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="card chart-container">
      <h3 className="chart-title">
        Atendimentos por Semana
      </h3>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-container">
            <div
              className="chart-bar"
              style={{
                height: `${(item.count / maxValue) * 120}px`
              }}
            >
              {item.count > 0 && (
                <span className="chart-bar-value">
                  {item.count}
                </span>
              )}
            </div>
            <div className="chart-label">
              {item.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
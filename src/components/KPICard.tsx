import React from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  colorClass?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  colorClass = 'primary'
}) => {
  return (
    <div className="card kpi-card">
      <h3 className="kpi-title">
        {title}
      </h3>
      <div className={`kpi-value ${colorClass}`}>
        {value}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { KPIData, WeeklyAttendance, ReportService } from '../services/ReportService';
import { Patient } from '../types/Patient';
import { KPICard } from '../components/KPICard';
import { WeeklyChart } from '../components/WeeklyChart';
import { PatientSummaryList } from '../components/PatientSummaryList';

export const Reports: React.FC = () => {
  const [kpis, setKpis] = useState<KPIData>({ atendimentoHoje: 0, pacientesEmFila: 0, taxaAtendimento: 0 });
  const [weeklyData, setWeeklyData] = useState<WeeklyAttendance[]>([]);
  const [lastAttended, setLastAttended] = useState<Patient[]>([]);
  const [nextInQueue, setNextInQueue] = useState<Patient[]>([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    setKpis(ReportService.getKPIs());
    setWeeklyData(ReportService.getWeeklyAttendance());
    setLastAttended(ReportService.getLastAttendedPatients());
    setNextInQueue(ReportService.getNextPatientsInQueue());
  };

  return (
    <div className="container page-container">
      <div className="header-with-button">
        <h1 className="page-title">
          Relatórios e KPIs
        </h1>
        <button
          onClick={loadReportData}
          className="btn btn-primary"
        >
          Atualizar Dados
        </button>
      </div>

      <div className="grid grid-3 section">
        <KPICard
          title="Atendimentos Hoje"
          value={kpis.atendimentoHoje}
          colorClass="accent"
        />
        <KPICard
          title="Pacientes em Fila"
          value={kpis.pacientesEmFila}
          colorClass="primary"
        />
        <KPICard
          title="Taxa de Atendimento"
          value={`${kpis.taxaAtendimento}%`}
          colorClass="accent"
        />
      </div>

      <div className="section">
        <WeeklyChart data={weeklyData} />
      </div>

      <div className="grid grid-2">
        <PatientSummaryList
          title="Últimos 5 Pacientes Atendidos"
          patients={lastAttended}
        />
        <PatientSummaryList
          title="Próximos 5 Pacientes na Fila"
          patients={nextInQueue}
        />
      </div>
    </div>
  );
};
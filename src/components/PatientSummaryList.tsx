import React from 'react';
import { Patient } from '../types/Patient';

interface PatientSummaryListProps {
  title: string;
  patients: Patient[];
}

export const PatientSummaryList: React.FC<PatientSummaryListProps> = ({ title, patients }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'URGENTE': return 'urgent';
      case 'ALTA': return 'high';
      case 'MEDIA': return 'medium';
      case 'BAIXA': return 'low';
      default: return 'low';
    }
  };

  const getPriorityTextClass = (priority: string) => {
    switch (priority) {
      case 'URGENTE': return 'urgent';
      case 'ALTA': return 'high';
      case 'MEDIA': return 'medium';
      case 'BAIXA': return 'low';
      default: return 'low';
    }
  };

  return (
    <div className="card">
      <h3 className="chart-title">{title}</h3>

      {patients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
          </div>
          <p className="empty-description">Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="patient-summary-list">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className={`patient-summary-item ${getPriorityClass(patient.prioridade)}`}
            >
              <div className="patient-name">
                {patient.nome}
              </div>
              <div className="patient-details">
                <div className="patient-priority">
                  Prioridade:{' '}
                  <span className={`priority-text ${getPriorityTextClass(patient.prioridade)}`}>
                    {patient.prioridade}
                  </span>
                </div>
                {patient.atualizadoEm && (
                  <div className="patient-date">
                    {formatDate(patient.atualizadoEm)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
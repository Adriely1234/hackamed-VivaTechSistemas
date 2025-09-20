import React from 'react';
import { Patient } from '../types/Patient';

interface PatientListProps {
  patients: Patient[];
  onStatusUpdate: (patientId: number, atendido: boolean) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, onStatusUpdate }) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'URGENTE': return 'priority-urgent';
      case 'ALTA': return 'priority-high';
      case 'MEDIA': return 'priority-medium';
      case 'BAIXA': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const getStatusClass = (atendido: boolean) => {
    return atendido ? 'status-attended' : 'status-waiting';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th className="hidden-mobile">Data Cadastro</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th className="hidden-tablet">Atualizado Em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="font-medium text-primary">
                  {patient.id}
                </td>
                <td>
                  <div className="font-medium text-primary">{patient.nome}</div>
                  <div className="hidden-mobile" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    {formatDate(patient.dataCadastro)}
                  </div>
                </td>
                <td className="hidden-mobile text-secondary">
                  {formatDate(patient.dataCadastro)}
                </td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(patient.prioridade)}`}>
                    {patient.prioridade}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(patient.atendido)}`}>
                    {patient.atendido ? 'Atendido' : 'Em Fila'}
                  </span>
                  <div className="hidden-tablet" style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                    {patient.atualizadoEm ? formatDate(patient.atualizadoEm) : '-'}
                  </div>
                </td>
                <td className="hidden-tablet text-secondary">
                  {patient.atualizadoEm ? formatDate(patient.atualizadoEm) : '-'}
                </td>
                <td>
                  <button
                    onClick={() => onStatusUpdate(patient.id, !patient.atendido)}
                    className={`btn btn-small ${patient.atendido ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {patient.atendido ? 'Reverter' : 'Atender'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Patient } from '../types/Patient';
import { PatientService } from '../services/PatientService';
import { CSVUploader } from '../components/CSVUploader';
import { PatientList } from '../components/PatientList';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const loadedPatients = PatientService.getPatients();
    setPatients(loadedPatients);
  }, []);

  const handlePatientsImported = (importedPatients: Patient[]) => {
    setPatients(importedPatients);
  };

  const handleStatusUpdate = (patientId: number, atendido: boolean) => {
    PatientService.updatePatientStatus(patientId, atendido);
    const updatedPatients = PatientService.getPatients();
    const sortedPatients = PatientService.sortPatientsByPriority(updatedPatients);
    PatientService.savePatients(sortedPatients);
    setPatients(sortedPatients);
  };

  return (
    <div className="container page-container">
      <h1 className="page-title">
        Gestão de Pacientes
      </h1>

      <section className="section">
        <h2 className="page-subtitle">
          Importar Pacientes via CSV
        </h2>
        <CSVUploader onPatientsImported={handlePatientsImported} />
      </section>

      <section>
        <div className="header-with-button">
          <h2 className="page-subtitle">
            Lista de Pacientes
          </h2>
          <span className="badge">
            Total: {patients.length}
          </span>
        </div>

        {patients.length > 0 ? (
          <PatientList patients={patients} onStatusUpdate={handleStatusUpdate} />
        ) : (
          <div className="card empty-state">
            <div className="empty-icon">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="empty-title">
              Nenhum paciente cadastrado
            </h3>
            <p className="empty-description">
              Importe um arquivo CSV para começar a gerenciar pacientes.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
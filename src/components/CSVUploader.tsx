import React, { useState } from 'react';
import { Patient, PatientCSVRow } from '../types/Patient';
import { PatientService } from '../services/PatientService';

interface CSVUploaderProps {
  onPatientsImported: (patients: Patient[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onPatientsImported }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        setErrors(['Arquivo CSV vazio']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['ID', 'NOME', 'DATA_CADASTRO', 'PRIORIDADE', 'ATENDIDO'];

      if (!expectedHeaders.every(header => headers.includes(header))) {
        setErrors(['Cabeçalho do CSV inválido. Esperado: ID,NOME,DATA_CADASTRO,PRIORIDADE,ATENDIDO']);
        return;
      }

      const patients: Patient[] = [];
      const importErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: PatientCSVRow = {
          ID: values[headers.indexOf('ID')] || '',
          NOME: values[headers.indexOf('NOME')] || '',
          DATA_CADASTRO: values[headers.indexOf('DATA_CADASTRO')] || '',
          PRIORIDADE: values[headers.indexOf('PRIORIDADE')] || '',
          ATENDIDO: values[headers.indexOf('ATENDIDO')] || ''
        };

        const rowErrors = PatientService.validateCSVRow(row);
        if (rowErrors.length > 0) {
          importErrors.push(`Linha ${i + 1}: ${rowErrors.join(', ')}`);
        } else {
          patients.push(PatientService.parseCSVRow(row));
        }
      }

      if (importErrors.length > 0) {
        setErrors(importErrors);
        return;
      }

      const existingCount = PatientService.getPatients().length;
      const mergedPatients = PatientService.importPatients(patients);
      const newCount = mergedPatients.length - existingCount;
      const duplicateCount = patients.length - newCount;

      if (newCount > 0) {
        setSuccessMessage(`${newCount} paciente(s) importado(s) com sucesso!${duplicateCount > 0 ? ` ${duplicateCount} paciente(s) já existia(m) e foram ignorados.` : ''}`);
      } else {
        setSuccessMessage('Todos os pacientes já existiam na base de dados.');
      }

      onPatientsImported(mergedPatients);

    } catch (error) {
      setErrors(['Erro ao processar arquivo CSV']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="form-group">
        <label className="form-label">
          Selecionar arquivo CSV
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isLoading}
          className="file-input"
        />
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Processando arquivo...</span>
        </div>
      )}

      {successMessage && (
        <div className="success-container">
          <h4 className="success-title">Importação concluída!</h4>
          <p className="success-message">{successMessage}</p>
        </div>
      )}

      {errors.length > 0 && (
        <div className="error-container">
          <h4 className="error-title">Erros encontrados:</h4>
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
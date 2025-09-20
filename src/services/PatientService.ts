import { Patient, PatientCSVRow, Priority } from '../types/Patient';

export class PatientService {
  private static readonly STORAGE_KEY = 'patients';

  static savePatients(patients: Patient[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
  }

  static getPatients(): Patient[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static sortPatientsByPriority(patients: Patient[]): Patient[] {
    const priorityOrder: Record<Priority, number> = {
      'URGENTE': 1,
      'ALTA': 2,
      'MEDIA': 3,
      'BAIXA': 4
    };

    return [...patients].sort((a, b) => {
      if (a.atendido && !b.atendido) return 1;
      if (!a.atendido && b.atendido) return -1;
      if (a.atendido && b.atendido) return 0;

      return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
    });
  }

  static updatePatientStatus(patientId: number, atendido: boolean): void {
    const patients = this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);

    if (patientIndex !== -1) {
      patients[patientIndex].atendido = atendido;
      patients[patientIndex].atualizadoEm = new Date().toISOString();
      this.savePatients(patients);
    }
  }

  static validateCSVRow(row: PatientCSVRow): string[] {
    const errors: string[] = [];

    if (!row.ID || isNaN(Number(row.ID))) {
      errors.push('ID deve ser um número válido');
    }

    if (!row.NOME || row.NOME.trim().length === 0) {
      errors.push('Nome é obrigatório');
    }

    if (!row.DATA_CADASTRO || !this.isValidDate(row.DATA_CADASTRO)) {
      errors.push('Data de cadastro deve estar no formato válido');
    }

    if (!['URGENTE', 'ALTA', 'MEDIA', 'BAIXA'].includes(row.PRIORIDADE)) {
      errors.push('Prioridade deve ser URGENTE, ALTA, MEDIA ou BAIXA');
    }

    if (!['TRUE', 'FALSE'].includes(row.ATENDIDO.toUpperCase())) {
      errors.push('Atendido deve ser TRUE ou FALSE');
    }

    return errors;
  }

  private static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  static parseCSVRow(row: PatientCSVRow): Patient {
    return {
      id: Number(row.ID),
      nome: row.NOME,
      dataCadastro: row.DATA_CADASTRO,
      prioridade: row.PRIORIDADE as Priority,
      atendido: row.ATENDIDO.toUpperCase() === 'TRUE'
    };
  }

  static mergePatients(existingPatients: Patient[], newPatients: Patient[]): Patient[] {
    const existingIds = new Set(existingPatients.map(p => p.id));
    const uniqueNewPatients = newPatients.filter(p => !existingIds.has(p.id));

    return [...existingPatients, ...uniqueNewPatients];
  }

  static importPatients(newPatients: Patient[]): Patient[] {
    const existingPatients = this.getPatients();
    const mergedPatients = this.mergePatients(existingPatients, newPatients);
    const sortedPatients = this.sortPatientsByPriority(mergedPatients);
    this.savePatients(sortedPatients);
    return sortedPatients;
  }
}
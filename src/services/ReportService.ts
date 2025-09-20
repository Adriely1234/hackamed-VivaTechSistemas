import { Patient } from '../types/Patient';
import { PatientService } from './PatientService';

export interface KPIData {
  atendimentoHoje: number;
  pacientesEmFila: number;
  taxaAtendimento: number;
}

export interface WeeklyAttendance {
  day: string;
  count: number;
}

export class ReportService {
  static getKPIs(): KPIData {
    const patients = PatientService.getPatients();
    const today = new Date().toDateString();

    const atendimentoHoje = patients.filter(p =>
      p.atendido && p.atualizadoEm && new Date(p.atualizadoEm).toDateString() === today
    ).length;

    const pacientesEmFila = patients.filter(p => !p.atendido).length;

    const totalPatients = patients.length;
    const totalAtendidos = patients.filter(p => p.atendido).length;
    const taxaAtendimento = totalPatients > 0 ? (totalAtendidos / totalPatients) * 100 : 0;

    return {
      atendimentoHoje,
      pacientesEmFila,
      taxaAtendimento: Math.round(taxaAtendimento * 100) / 100
    };
  }

  static getWeeklyAttendance(): WeeklyAttendance[] {
    const patients = PatientService.getPatients();
    const weeklyData: Record<string, number> = {};

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      weeklyData[dayName] = 0;
    }

    patients
      .filter(p => p.atendido && p.atualizadoEm)
      .forEach(p => {
        const attendanceDate = new Date(p.atualizadoEm!);
        const daysDiff = Math.floor((today.getTime() - attendanceDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff >= 0 && daysDiff <= 6) {
          const dayName = attendanceDate.toLocaleDateString('pt-BR', { weekday: 'short' });
          if (weeklyData[dayName] !== undefined) {
            weeklyData[dayName]++;
          }
        }
      });

    return Object.entries(weeklyData).map(([day, count]) => ({ day, count }));
  }

  static getLastAttendedPatients(): Patient[] {
    const patients = PatientService.getPatients();
    return patients
      .filter(p => p.atendido && p.atualizadoEm)
      .sort((a, b) => new Date(b.atualizadoEm!).getTime() - new Date(a.atualizadoEm!).getTime())
      .slice(0, 5);
  }

  static getNextPatientsInQueue(): Patient[] {
    const patients = PatientService.getPatients();
    const sortedPatients = PatientService.sortPatientsByPriority(patients);
    return sortedPatients.filter(p => !p.atendido).slice(0, 5);
  }
}
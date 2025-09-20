export type Priority = 'URGENTE' | 'ALTA' | 'MEDIA' | 'BAIXA';

export interface Patient {
  id: number;
  nome: string;
  dataCadastro: string;
  prioridade: Priority;
  atendido: boolean;
  atualizadoEm?: string;
}

export interface PatientCSVRow {
  ID: string;
  NOME: string;
  DATA_CADASTRO: string;
  PRIORIDADE: string;
  ATENDIDO: string;
}
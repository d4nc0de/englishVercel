import { AulaJornada } from '@/models/historicos/aula-jornada';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AulaHorarioHistoricoService {
  async getAll(): Promise<AulaJornada[]> {
    return new Promise<AulaJornada[]>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(this.dummyAulaJornadas());
    });
  }

  async getActual(aulaid: number): Promise<AulaJornada> {
    return new Promise<AulaJornada>((resolve, reject) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      const historial = this.dummyAulaJornadas().find(at => at.aulaid === aulaid && !at.fecha_fin);

      resolve(historial!)
    });
  }

  async updateAulaHorarioHistory(aulajornadahistoricoid: number, data: any): Promise<AulaJornada> {
    return new Promise<AulaJornada>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve({
        aulajornadahistoricoid: aulajornadahistoricoid,
        ...data
      })
    });
  }

  async createAulaHorarioHistory(data: any): Promise<any> {
    return new Promise<any>((resolve) => {
      // TODO: CALL API
      console.log("⚠️ LLAMADA REAL A API. NO DEBE SALIR ESTE CONSOLE.LOG EN PRODUCCIÓN");

      resolve(data);
    });
  }

  private dummyAulaJornadas(): AulaJornada[] {
    return [
      {
        aulajornadahistoricoid: 1,
        fecha_inicio: new Date('2023-01-01'),
        motivo_cambio: 'Jornada inicial',
        jornadaid: 1,
        aulaid: 1
      },
      {
        aulajornadahistoricoid: 2,
        fecha_inicio: new Date('2023-06-01'),
        motivo_cambio: 'Jornada inicial',
        jornadaid: 2,
        aulaid: 2
      },
      {
        aulajornadahistoricoid: 3,
        fecha_inicio: new Date('2023-03-15'),
        motivo_cambio: 'Jornada inicial',
        jornadaid: 3,
        aulaid: 3
      },
      {
        aulajornadahistoricoid: 4,
        fecha_inicio: new Date('2023-09-10'),
        motivo_cambio: 'Jornada inicial',
        jornadaid: 4,
        aulaid: 4
      },
      {
        aulajornadahistoricoid: 5,
        fecha_inicio: new Date('2023-05-20'),
        motivo_cambio: 'Jornada inicial',
        jornadaid: 5,
        aulaid: 5
      }
    ];
  }
}
